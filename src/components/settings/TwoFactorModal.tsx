import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Copy, Check, QrCode, AlertCircle } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TwoFactorModal({ isOpen, onClose }: TwoFactorModalProps) {
  const { privacy, enable2FA } = useSettings();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState('');
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  if (!isOpen) return null;

  const handleCopySecret = () => {
    navigator.clipboard.writeText(privacy.twoFactorSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleCopyRecoveryCodes = () => {
    navigator.clipboard.writeText(privacy.twoFactorRecoveryCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleVerify = () => {
    if (verifyCode.length !== 6 || !/^\d+$/.test(verifyCode)) {
      setError('Please enter a valid 6-digit numeric verification code.');
      return;
    }
    setError('');
    enable2FA(verifyCode);
    setStep(3);
  };

  const handleFinish = () => {
    onClose();
    setStep(1);
    setVerifyCode('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none font-mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg rounded-md bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F7F7F7] dark:bg-[#101010]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-sm text-[#111111] dark:text-white uppercase tracking-wider">
                  TWO-FACTOR AUTHENTICATION (2FA)
                </span>
                <span className="text-[9px] text-[#888888] dark:text-[#777777] uppercase tracking-widest">
                  STEP {step} OF 3
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded text-[#666666] dark:text-[#999999] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#111111] dark:text-white">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  Enhance your CyberPath security by configuring time-based one-time passwords (TOTP). Use Google Authenticator, Authy, or 1Password.
                </p>

                {/* QR Code Placeholder Graphic */}
                <div className="p-5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#101010] flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-28 bg-white p-2 rounded border border-[#E5E5E5] flex items-center justify-center shrink-0 shadow-inner">
                    <QrCode size={92} className="text-[#111111]" />
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                      MANUAL SETUP KEY
                    </span>
                    <div className="p-2 rounded bg-white dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] flex items-center justify-between gap-2 font-mono text-[11px] font-bold">
                      <span className="truncate">{privacy.twoFactorSecret}</span>
                      <button
                        onClick={handleCopySecret}
                        className="text-[#888888] dark:text-[#777777] hover:text-[#111111] dark:hover:text-white p-1"
                        title="Copy Secret"
                      >
                        {copiedSecret ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>
                    </div>
                    <span className="text-[10px] text-[#666666] dark:text-[#888888] font-sans block">
                      Scan the QR code or enter the secret key into your authenticator app.
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-sans flex items-start gap-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>
                    <strong>Auth Provider Notice:</strong> This interactive simulation prepares your UI preferences. Production deployments connect with your OAuth/SAML identity provider.
                  </span>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full btn-cyber-primary text-xs py-2.5"
                >
                  <span>NEXT: VERIFY CODE →</span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">
                    ENTER 6-DIGIT VERIFICATION CODE
                  </span>
                  <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans">
                    Type the 6-digit code generated by your authenticator app to confirm configuration.
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded py-3 text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
                    autoFocus
                  />
                  {error && <span className="text-[10px] text-rose-500 font-bold block">{error}</span>}
                  <span className="text-[10px] text-[#888888] dark:text-[#777777] block text-center">
                    (Tip: Enter any 6-digit code e.g. <code>123456</code> to complete test setup)
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setStep(1)}
                    className="btn-cyber-secondary text-xs py-2 px-4 flex-1"
                  >
                    ← BACK
                  </button>
                  <button
                    onClick={handleVerify}
                    className="btn-cyber-primary text-xs py-2 px-4 flex-1"
                  >
                    CONFIRM & ENABLE →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                  <Check size={16} className="shrink-0" />
                  <span className="font-bold">2FA ENABLED SUCCESSFULLY</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">
                      RECOVERY BACKUP CODES
                    </span>
                    <button
                      onClick={handleCopyRecoveryCodes}
                      className="text-[10px] text-[#111111] dark:text-white font-bold flex items-center gap-1 hover:underline"
                    >
                      {copiedCodes ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                      <span>{copiedCodes ? 'COPIED' : 'COPY ALL'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-[#666666] dark:text-[#888888] font-sans">
                    Store these emergency backup codes in a secure password manager. Each code can be used once if you lose access to your authenticator app.
                  </p>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] font-mono text-xs">
                    {privacy.twoFactorRecoveryCodes.map((code) => (
                      <code key={code} className="p-1 rounded bg-white dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center font-bold">
                        {code}
                      </code>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full btn-cyber-primary text-xs py-2.5"
                >
                  DONE & CLOSE
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
