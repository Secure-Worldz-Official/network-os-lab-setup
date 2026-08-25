import { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useCyberPath } from '@/context/CyberPathContext';
import { User, Shield, Award, Edit3, Lock, Check } from 'lucide-react';
import { ChangePasswordModal } from './ChangePasswordModal';

const AVATAR_OPTIONS = [
  { id: 'shield', label: 'Shield Defender', icon: '🛡' },
  { id: 'terminal', label: 'Terminal Root', icon: '💻' },
  { id: 'cyber', label: 'Cyber Operative', icon: '⚡' },
  { id: 'lock', label: 'Crypto Guard', icon: '🔐' },
  { id: 'radar', label: 'Network Scout', icon: '📡' },
  { id: 'skull', label: 'Red Team Hunter', icon: '🎯' }
];

export function AccountSection() {
  const { account, updateAccount, privacy, updatePrivacy, showToast } = useSettings();
  const { xp, level, levelName, getLeaderboard } = useCyberPath();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form states
  const [username, setUsername] = useState(account.username);
  const [displayName, setDisplayName] = useState(account.displayName);
  const [email, setEmail] = useState(account.email);
  const [bio, setBio] = useState(account.bio);
  const [country, setCountry] = useState(account.country);
  const [selectedAvatar, setSelectedAvatar] = useState(account.avatar);

  const leaderboard = getLeaderboard();
  const userRank = leaderboard.find((e) => e.isCurrentUser)?.rank || 1;

  const handleStartEdit = () => {
    setUsername(account.username);
    setDisplayName(account.displayName);
    setEmail(account.email);
    setBio(account.bio);
    setCountry(account.country);
    setSelectedAvatar(account.avatar);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    updateAccount({
      username: username.trim() || account.username,
      displayName: displayName.trim() || account.displayName,
      email: email.trim() || account.email,
      bio: bio.trim() || account.bio,
      country: country.trim() || account.country,
      avatar: selectedAvatar
    });
    setIsEditing(false);
    showToast('PROFILE UPDATED');
  };

  const currentAvatarObj = AVATAR_OPTIONS.find((a) => a.id === account.avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="space-y-6 font-mono">
      {/* Account Overview Header Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md bg-[#111111] dark:bg-white text-white dark:text-[#080808] flex items-center justify-center text-2xl font-bold shadow-md select-none">
            {currentAvatarObj.icon}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                {account.displayName}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white">
                @{account.username}
              </span>
            </div>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans line-clamp-1 max-w-md">
              {account.bio}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={handleStartEdit}
                className="btn-cyber-primary text-xs py-2 px-3.5 flex-1 sm:flex-none"
              >
                <Edit3 size={13} />
                <span>EDIT PROFILE</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="btn-cyber-secondary text-xs py-2 px-3.5 flex-1 sm:flex-none"
              >
                <Lock size={13} />
                <span>CHANGE PASSWORD</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-cyber-secondary text-xs py-2 px-3.5 flex-1 sm:flex-none"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="btn-cyber-primary text-xs py-2 px-3.5 flex-1 sm:flex-none"
              >
                <Check size={13} />
                <span>SAVE CHANGES</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Account Details & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form or Readonly View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
              <User size={14} />
              OPERATIVE CREDENTIAL DETAILS
            </h3>

            {isEditing ? (
              <div className="space-y-4 text-xs">
                {/* Avatar Picker */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                    CHOOSE OPERATIVE AVATAR
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`p-3 rounded border text-center flex flex-col items-center gap-1 transition-all ${
                          selectedAvatar === av.id
                            ? 'border-[#111111] dark:border-white bg-[#F7F7F7] dark:bg-[#202020] ring-1 ring-[#111111] dark:ring-white'
                            : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-transparent hover:border-[#CCCCCC]'
                        }`}
                      >
                        <span className="text-xl">{av.icon}</span>
                        <span className="text-[9px] font-bold truncate w-full">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                      OPERATIVE HANDLE (USERNAME)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                      PUBLIC DISPLAY NAME
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                      PRIMARY EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                      COUNTRY / REGION
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] block">
                    OPERATIVE BIOGRAPHY / RESEARCH FOCUS
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded px-3 py-2 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777]">OPERATIVE HANDLE</span>
                  <p className="font-bold text-[#111111] dark:text-white">@{account.username}</p>
                </div>

                <div className="p-3 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777]">DISPLAY NAME</span>
                  <p className="font-bold text-[#111111] dark:text-white">{account.displayName}</p>
                </div>

                <div className="p-3 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777]">EMAIL ADDRESS</span>
                  <p className="font-bold text-[#111111] dark:text-white truncate">{account.email}</p>
                </div>

                <div className="p-3 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777]">COUNTRY & REGION</span>
                  <p className="font-bold text-[#111111] dark:text-white">{account.country}</p>
                </div>

                <div className="sm:col-span-2 p-3 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#888888] dark:text-[#777777]">RESEARCH BIO</span>
                  <p className="text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">{account.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile Visibility Preferences */}
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
              <Shield size={14} />
              PROFILE METRICS VISIBILITY PREFERENCES
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <span className="font-bold text-[#111111] dark:text-white block">Show Total XP Publicly</span>
                  <span className="text-[10px] text-[#666666] dark:text-[#888888] font-sans block">
                    Allow other operatives to view your total accumulated experience points.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showXp}
                  onChange={(e) => updatePrivacy({ showXp: e.target.checked })}
                  className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <span className="font-bold text-[#111111] dark:text-white block">Show Achievements Publicly</span>
                  <span className="text-[10px] text-[#666666] dark:text-[#888888] font-sans block">
                    Display unlocked clearance badges and certifications on public profiles.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showAchievements}
                  onChange={(e) => updatePrivacy({ showAchievements: e.target.checked })}
                  className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <div>
                  <span className="font-bold text-[#111111] dark:text-white block">Show on Global Leaderboard</span>
                  <span className="text-[10px] text-[#666666] dark:text-[#888888] font-sans block">
                    Include operative standings in the live CyberPath platform leaderboard.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.showLeaderboard}
                  onChange={(e) => updatePrivacy({ showLeaderboard: e.target.checked })}
                  className="w-4 h-4 accent-black dark:accent-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Stats Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
              <Award size={14} />
              PLATFORM CLEARANCE STATS
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] font-bold">CURRENT LEVEL</span>
                <span className="font-extrabold text-[#111111] dark:text-white">LEVEL {level}</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] font-bold">TOTAL ACCUMULATED XP</span>
                <span className="font-extrabold text-[#111111] dark:text-white">{xp.toLocaleString()} XP</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] font-bold">SECURITY RANK</span>
                <span className="font-extrabold text-[#111111] dark:text-white">#{userRank} ({levelName})</span>
              </div>

              <div className="flex justify-between items-center p-2.5 rounded bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777] font-bold">ACCOUNT CREATED</span>
                <span className="font-bold text-[#555555] dark:text-[#B5B5B5]">{account.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
