import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Shield, ShieldCheck, Lock, Smartphone, Laptop, LogOut, History, Key, Check } from 'lucide-react';
import { TwoFactorModal } from './TwoFactorModal';
import { ChangePasswordModal } from './ChangePasswordModal';

export function PrivacySecuritySection() {
  const { privacy, updatePrivacy, signOutOtherSessions, disable2FA } = useSettings();
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const privacyToggles: Array<{
    key: keyof Pick<typeof privacy, 'showOnlineStatus' | 'showActivity' | 'showXp' | 'showAchievements' | 'showLeaderboard'>;
    title: string;
    description: string;
  }> = [
    {
      key: 'showOnlineStatus',
      title: 'Show Online / Active Indicator',
      description: 'Display a live green status badge when you are actively connected and working in labs.'
    },
    {
      key: 'showActivity',
      title: 'Public Activity Stream',
      description: 'Include completed room challenges and certification milestones in the platform activity feed.'
    },
    {
      key: 'showXp',
      title: 'Public XP & Rank Display',
      description: 'Display your accumulated experience points on your public operative profile card.'
    },
    {
      key: 'showAchievements',
      title: 'Public Badges & Clearance Awards',
      description: 'Permit other operatives to view unlocked security badges and lab certificates.'
    },
    {
      key: 'showLeaderboard',
      title: 'Leaderboard Participation',
      description: 'List your operative rank in the global competitive ranking index.'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* 2FA & Authentication Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Key size={14} />
          AUTHENTICATION & CREDENTIAL SECURITY
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Password Box */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111111] dark:text-white uppercase text-[11px]">
                  ACCOUNT PASSWORD
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ● SECURED
                </span>
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Last updated 3 days ago. Strong alphanumeric phrase configured.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="btn-cyber-secondary text-xs py-2 px-3.5 w-full justify-center"
            >
              <Lock size={13} />
              <span>CHANGE PASSWORD</span>
            </button>
          </div>

          {/* 2FA Box */}
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111111] dark:text-white uppercase text-[11px]">
                  TWO-FACTOR AUTHENTICATION (2FA)
                </span>
                {privacy.twoFactorEnabled ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase border border-emerald-500/20">
                    ✓ ENABLED
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase border border-amber-500/20">
                    NOT ENABLED
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                {privacy.twoFactorEnabled
                  ? 'TOTP app verification active. Backup recovery codes generated.'
                  : 'Protect your account from credential stuffing with time-based OTP.'}
              </p>
            </div>

            {privacy.twoFactorEnabled ? (
              <button
                type="button"
                onClick={disable2FA}
                className="btn-cyber-secondary text-xs py-2 px-3.5 w-full justify-center text-rose-600 dark:text-rose-400 border-rose-500/30 hover:border-rose-500"
              >
                <span>DISABLE 2FA</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShow2FAModal(true)}
                className="btn-cyber-primary text-xs py-2 px-3.5 w-full justify-center"
              >
                <ShieldCheck size={13} />
                <span>ENABLE 2FA</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Preferences Toggles */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Shield size={14} />
            OPERATIVE PRIVACY CONTROLS
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777]">PROFILE VISIBILITY:</span>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => updatePrivacy({ profileVisibility: e.target.value as any })}
              className="bg-[#FAFAFA] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-2.5 py-1 text-xs font-mono font-bold text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white"
            >
              <option value="public">PUBLIC (ALL OPERATIVES)</option>
              <option value="restricted">RESTRICTED</option>
              <option value="private">PRIVATE (STEALTH)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          {privacyToggles.map((item) => {
            const isChecked = privacy[item.key] as boolean;

            return (
              <div
                key={item.key}
                onClick={() => updatePrivacy({ [item.key]: !isChecked })}
                className="flex items-center justify-between p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC] dark:hover:border-[#444444] cursor-pointer transition-all duration-150"
              >
                <div className="pr-4 space-y-0.5">
                  <span className="font-bold text-xs text-[#111111] dark:text-white uppercase font-heading block">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-[#666666] dark:text-[#B5B5B5] font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <div
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isChecked
                        ? 'bg-[#111111] text-white dark:bg-white dark:text-[#080808]'
                        : 'bg-[#E5E5E5] dark:bg-[#2A2A2A]'
                    }`}
                  >
                    <div
                      className={`bg-white dark:bg-[#080808] w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out flex items-center justify-center ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    >
                      {isChecked && <Check size={10} className="text-[#111111] dark:text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Login Sessions */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Laptop size={14} />
              ACTIVE OPERATIVE SESSIONS ({privacy.activeSessions.length})
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
              Devices and browsers currently authenticated to your CyberPath identity.
            </p>
          </div>

          {privacy.activeSessions.length > 1 && (
            <button
              type="button"
              onClick={signOutOtherSessions}
              className="btn-cyber-secondary text-xs py-1.5 px-3 shrink-0"
            >
              <LogOut size={12} />
              <span>SIGN OUT OTHER SESSIONS</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {privacy.activeSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#F0F0F0] dark:bg-[#181818] text-[#111111] dark:text-white flex items-center justify-center shrink-0">
                  {sess.device.includes('Windows') ? <Laptop size={16} /> : <Smartphone size={16} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111111] dark:text-white">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase border border-emerald-500/20">
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#666666] dark:text-[#888888] font-mono">
                    {sess.browser} • IP: {sess.ip}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-[#888888] dark:text-[#777777] font-mono">
                {sess.lastActive}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Audit Activity Log */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <History size={14} />
          SECURITY AUDIT HISTORY LOG
        </h3>

        <div className="space-y-2 text-xs">
          {privacy.securityLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-[#111111] dark:text-white block uppercase text-[11px]">
                  {log.title}
                </span>
                <span className="text-[10px] text-[#666666] dark:text-[#888888] font-sans block">
                  {log.detail} (Origin IP: {log.ip})
                </span>
              </div>
              <span className="text-[10px] text-[#888888] dark:text-[#777777] font-mono shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      <TwoFactorModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
