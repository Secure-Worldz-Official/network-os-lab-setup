import { useSettings } from '@/context/SettingsContext';
import { Bell, Mail, ShieldAlert, Zap, Flame, Trophy, Terminal, Compass, Check } from 'lucide-react';

export function NotificationsSection() {
  const { notifications, updateNotifications } = useSettings();

  const notifItems: Array<{
    key: keyof Omit<typeof notifications, 'emailFrequency'>;
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }> = [
    {
      key: 'dailyReminder',
      title: 'Daily Learning Reminder',
      description: "Receive a reminder when you haven't completed your daily learning activity.",
      icon: Bell
    },
    {
      key: 'streakReminder',
      title: 'Streak Safeguard Alert',
      description: 'Get notified 4 hours before daily UTC midnight to protect your active training streak.',
      icon: Flame
    },
    {
      key: 'roomCompletion',
      title: 'Room Completion Milestones',
      description: 'Receive summary notifications whenever you successfully complete all tasks in a room.',
      icon: Terminal
    },
    {
      key: 'achievementUnlocked',
      title: 'Achievement & Badge Clearance',
      description: 'Instant notification when new clearance credentials and badges are unlocked.',
      icon: Trophy
    },
    {
      key: 'levelUp',
      title: 'Operative Rank Promotion',
      description: 'Notify when your accumulated XP promotes you to the next security rank level.',
      icon: Zap
    },
    {
      key: 'challengeUpdates',
      title: 'New Challenges & CTF Drops',
      description: 'Get alerted when new time-limited challenges, flags, and capture exercises drop.',
      icon: Trophy
    },
    {
      key: 'newPaths',
      title: 'New Career Learning Pathways',
      description: 'Updates when new curriculum modules and offensive/defensive pathways are released.',
      icon: Compass
    },
    {
      key: 'labExpiration',
      title: 'Virtual Lab Session Expiration',
      description: 'Warning notification 5 minutes before your active containerized target expires.',
      icon: Terminal
    },
    {
      key: 'securityAlerts',
      title: 'Account & Security Alerts',
      description: 'Critical notifications about new browser sessions, VPN access, and credential updates.',
      icon: ShieldAlert
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Notifications Control Panel */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Bell size={14} />
              TRAINING & SYSTEM NOTIFICATION PREFERENCES
            </h3>
            <p className="text-xs text-[#666666] dark:text-[#B5B5B5] font-sans">
              Choose which alerts you wish to receive across the CyberPath interface and email.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="text-[#888888] dark:text-[#777777]">ACTIVE ALERTS:</span>
            <span className="px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#333333] text-[#111111] dark:text-white">
              {Object.values(notifications).filter((v) => v === true).length} / 9 ENABLED
            </span>
          </div>
        </div>

        {/* 9 Toggle Items */}
        <div className="space-y-2.5">
          {notifItems.map((item) => {
            const Icon = item.icon;
            const isChecked = notifications[item.key] as boolean;

            return (
              <div
                key={item.key}
                onClick={() => updateNotifications({ [item.key]: !isChecked })}
                className="flex items-center justify-between p-3.5 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] hover:border-[#CCCCCC] dark:hover:border-[#444444] cursor-pointer transition-all duration-150"
              >
                <div className="flex items-start gap-3.5 pr-4">
                  <div className="w-8 h-8 rounded bg-[#F0F0F0] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-[#111111] dark:text-white uppercase font-heading">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[#666666] dark:text-[#B5B5B5] font-sans leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
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

      {/* Delivery Frequency */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <Mail size={14} />
          EMAIL DIGEST & DISPATCH FREQUENCY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {[
            { id: 'immediate', title: 'REAL-TIME DISPATCH', desc: 'Alerts sent immediately upon event trigger' },
            { id: 'daily', title: 'DAILY DIGEST', desc: 'Single consolidated summary sent once a day' },
            { id: 'weekly', title: 'WEEKLY COMPENDIUM', desc: 'Comprehensive weekly progress recap email' }
          ].map((freq) => (
            <button
              key={freq.id}
              type="button"
              onClick={() => updateNotifications({ emailFrequency: freq.id as any })}
              className={`p-3.5 rounded border text-left flex flex-col justify-between space-y-1 transition-all ${
                notifications.emailFrequency === freq.id
                  ? 'border-[#111111] dark:border-white bg-[#F7F7F7] dark:bg-[#181818] ring-1 ring-[#111111] dark:ring-white'
                  : 'border-[#E5E5E5] dark:border-[#2A2A2A] bg-transparent hover:border-[#CCCCCC]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-[#111111] dark:text-white uppercase">
                  {freq.title}
                </span>
                {notifications.emailFrequency === freq.id && (
                  <Check size={12} className="text-[#111111] dark:text-white stroke-[3]" />
                )}
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                {freq.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
