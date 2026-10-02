import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { BATCH_DATA, CLAIMS_LIST } from './src/data/mockData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory / database state cache
let currentBatch = { ...BATCH_DATA };
let currentClaims = [...CLAIMS_LIST];

// 1. GET /api/batch - Fetch current settlement batch
app.get('/api/batch', async (_req: Request, res: Response) => {
  try {
    res.json({
      batch: currentBatch,
      provider: {
        name: currentBatch.providerName,
        tier: currentBatch.providerTier,
        locations: currentBatch.providerLocations,
        nhiaReg: currentBatch.providerNhiaReg,
        bankName: currentBatch.bankName,
        accountNumberMasked: currentBatch.accountNumberMasked,
        accountName: currentBatch.accountName,
      },
    });
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ error: 'Failed to fetch settlement batch' });
  }
});

// 2. GET /api/claims - Fetch itemized claims
app.get('/api/claims', async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    if (category && category !== 'all') {
      const filtered = currentClaims.filter((c) => c.category === category);
      return res.json(filtered);
    }
    res.json(currentClaims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Failed to fetch claims list' });
  }
});

// 3. POST /api/batch/authorize - Executive Biometric Authorization
app.post('/api/batch/authorize', async (req: Request, res: Response) => {
  try {
    const { checkerName, checkerSignId } = req.body;
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WAT`;

    currentBatch = {
      ...currentBatch,
      checkerName: checkerName || 'Dr. A. O. Adelekan (MD, FMCOG)',
      checkerTitle: 'Chief Financial Office / MD',
      checkerTimestamp: timestampStr,
      checkerSignId: checkerSignId || 'Biometric Sign ID #KEY-OK-9924',
      executionStamp: timestampStr,
    };

    res.json({
      success: true,
      batch: currentBatch,
      message: 'Settlement authorized and queued for automated NIP dispatch.',
    });
  } catch (error) {
    console.error('Error authorizing batch:', error);
    res.status(500).json({ error: 'Failed to authorize batch' });
  }
});

// 4. POST /api/batch/flag - Flag batch and return to Claims Audit
app.post('/api/batch/flag', async (req: Request, res: Response) => {
  try {
    const { reason, notes } = req.body;

    currentBatch = {
      ...currentBatch,
      disputedReason: notes ? `Discrepancy: ${reason} - ${notes}` : `Discrepancy: ${reason}`,
    };

    res.json({
      success: true,
      batch: currentBatch,
      message: 'Batch returned to Claims Audit.',
    });
  } catch (error) {
    console.error('Error flagging batch:', error);
    res.status(500).json({ error: 'Failed to flag batch' });
  }
});

// 5. GET /api/audit-summary - Compute performance KPIs
app.get('/api/audit-summary', async (_req: Request, res: Response) => {
  try {
    const totalClaims = currentClaims.length;
    const flaggedClaims = currentClaims.filter((c) => c.status === 'Disputed');
    const clearedClaims = currentClaims.filter((c) => c.status === 'Approved');
    const successRate = totalClaims > 0 ? ((clearedClaims.length / totalClaims) * 100).toFixed(1) : '97.6';

    res.json({
      totalClaims,
      clearedCount: clearedClaims.length,
      flaggedCount: flaggedClaims.length,
      successRate: parseFloat(successRate),
      batchSummary: currentBatch,
      categories: {
        surgical: currentClaims.filter((c) => c.category === 'surgical').length,
        inpatient: currentClaims.filter((c) => c.category === 'inpatient').length,
        diagnostics: currentClaims.filter((c) => c.category === 'diagnostics').length,
        pharmacy: currentClaims.filter((c) => c.category === 'pharmacy').length,
      },
    });
  } catch (error) {
    console.error('Error computing audit summary:', error);
    res.status(500).json({ error: 'Failed to compute audit summary' });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ApexCare Full-Stack Server running on port ${port}`);
  });
}

startServer();
