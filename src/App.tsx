import React, { useState } from 'react';
import { BATCH_DATA, CLAIMS_LIST } from './data/mockData';
import { ClaimItem } from './types';
import { Header } from './components/Header';
import { ScreenOnePreAuth } from './components/ScreenOnePreAuth';
import { ScreenTwoCompleted } from './components/ScreenTwoCompleted';
import { ScreenAuditSummary } from './components/ScreenAuditSummary';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { RemittanceSlipModal } from './components/RemittanceSlipModal';
import { ClaimDetailModal } from './components/ClaimDetailModal';
import { FlagAuditModal } from './components/FlagAuditModal';
import { Toast } from './components/Toast';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'screen1' | 'screen2' | 'audit'>('screen1');
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [showBiometricModal, setShowBiometricModal] = useState<boolean>(false);
  const [showRemittanceModal, setShowRemittanceModal] = useState<boolean>(false);
  const [showFlagModal, setShowFlagModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleAuthorizeClick = () => {
    // Open biometric authentication modal
    setShowBiometricModal(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometricModal(false);
    setIsAuthorizing(true);
    showToast('Batch Authorized & Queued for NIBSS NIP');
    setTimeout(() => {
      setIsAuthorizing(false);
      setCurrentScreen('screen2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const handleFlagSubmit = (reason: string, notes: string) => {
    setShowFlagModal(false);
    showToast(`Batch flagged: ${reason.replace('_', ' ').toUpperCase()}. Returned to Claims Audit.`);
    // Automatically transition to Audit Summary to review the exception
    setTimeout(() => {
      setCurrentScreen('audit');
    }, 900);
  };

  const getHeaderTitles = () => {
    switch (currentScreen) {
      case 'audit':
        return {
          title: 'Audit Summary',
          subtitle: 'Statutory Performance & Settlement KPI',
        };
      case 'screen2':
        return {
          title: 'Pre Authorization Detail',
          subtitle: 'Clinical Authorization Flow',
        };
      default:
        return {
          title: 'Pre Authorization Detail',
          subtitle: 'Clinical Authorization Flow',
        };
    }
  };

  const headerTitles = getHeaderTitles();

  return (
    <div className="min-h-screen bg-[#f0f2f8] text-[#131b2e] flex flex-col items-center">
      {/* Top Demo Bar / Screen Switcher for reviewer navigation */}
      <div className="w-full bg-[#131b2e] text-white px-3 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-50 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#aaf0dc]"></span>
          <span className="font-semibold text-slate-200">ApexCare Clinical Enterprise</span>
          <span className="text-slate-400 hidden sm:inline">• NHIA Dual-Control System</span>
        </div>

        {/* 3-Screen Segmented Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setCurrentScreen('screen1')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'screen1'
                ? 'bg-[#004337] text-[#aaf0dc] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Pre-Auth Review
          </button>
          <button
            onClick={() => setCurrentScreen('screen2')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
              currentScreen === 'screen2'
                ? 'bg-[#004337] text-[#aaf0dc] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Settlement Done
          </button>
          <button
            onClick={() => setCurrentScreen('audit')}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
              currentScreen === 'audit'
                ? 'bg-[#004337] text-[#aaf0dc] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>3. Audit Summary</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            title="Toggle Mobile Viewport Frame"
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700 transition-colors"
          >
            <span className="text-[12px] leading-none select-none">
              {deviceFrameMode ? '🖥️' : '📱'}
            </span>
            <span>{deviceFrameMode ? 'Full Viewport' : 'Mobile Frame'}</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <Toast message={toastMessage} />

      {/* Main Container - Responsive Mobile Mockup Frame or Fluid Canvas */}
      <div
        className={`w-full transition-all duration-200 ${
          deviceFrameMode
            ? 'max-w-[440px] my-0 sm:my-4 sm:rounded-[2.5rem] sm:shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:border-[8px] sm:border-slate-800 overflow-hidden'
            : 'max-w-2xl'
        } bg-[#faf8ff] min-h-[100dvh] flex flex-col relative`}
      >
        {/* Navigation Header */}
        <Header
          title={headerTitles.title}
          subtitle={headerTitles.subtitle}
          onBack={() => {
            if (currentScreen === 'audit' || currentScreen === 'screen2') {
              setCurrentScreen('screen1');
            } else {
              showToast('Clinical Authorization Flow: Primary Batch Level');
            }
          }}
          showBack={true}
        />

        {/* Dynamic Screen Router */}
        <main className="flex-1 flex flex-col relative w-full pt-16 bg-[#faf8ff]">
          {currentScreen === 'screen1' && (
            <ScreenOnePreAuth
              batch={BATCH_DATA}
              claims={CLAIMS_LIST}
              onAuthorize={handleAuthorizeClick}
              onOpenClaim={(claim) => setSelectedClaim(claim)}
              onOpenRemittance={() => setShowRemittanceModal(true)}
              onFlagBatch={() => setShowFlagModal(true)}
              onShowToast={showToast}
              onOpenAuditSummary={() => setCurrentScreen('audit')}
              isAuthorizing={isAuthorizing}
            />
          )}

          {currentScreen === 'screen2' && (
            <ScreenTwoCompleted
              batch={BATCH_DATA}
              onBackToLedger={() => setCurrentScreen('screen1')}
              onOpenRemittance={() => setShowRemittanceModal(true)}
              onShowToast={showToast}
              onOpenAuditSummary={() => setCurrentScreen('audit')}
            />
          )}

          {currentScreen === 'audit' && (
            <ScreenAuditSummary
              batch={BATCH_DATA}
              claims={CLAIMS_LIST}
              onBackToLedger={() => setCurrentScreen('screen1')}
              onOpenClaim={(claim) => setSelectedClaim(claim)}
              onOpenRemittance={() => setShowRemittanceModal(true)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <BiometricAuthModal
        batch={BATCH_DATA}
        isOpen={showBiometricModal}
        onClose={() => setShowBiometricModal(false)}
        onSuccess={handleBiometricSuccess}
      />

      <RemittanceSlipModal
        batch={BATCH_DATA}
        claims={CLAIMS_LIST}
        isOpen={showRemittanceModal}
        onClose={() => setShowRemittanceModal(false)}
        onShowToast={showToast}
      />

      <ClaimDetailModal
        claim={selectedClaim}
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        onShowToast={showToast}
      />

      <FlagAuditModal
        batch={BATCH_DATA}
        isOpen={showFlagModal}
        onClose={() => setShowFlagModal(false)}
        onSubmit={handleFlagSubmit}
      />
    </div>
  );
}
