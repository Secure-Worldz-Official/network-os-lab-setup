import { useState } from 'react';
import { HelpCircle, Book, Terminal, MessageSquare, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { ShortcutsModal } from './ShortcutsModal';
import { useSettings } from '@/context/SettingsContext';

export function HelpAboutSection() {
  const { showToast } = useSettings();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const faqs = [
    {
      q: 'How does the CyberPath virtual lab container work?',
      a: 'Each practical room provisions an isolated target container instance with mock services (SSH, HTTP, MySQL, DNS). You interact with it directly via our built-in web terminal or connected OpenVPN profiles.'
    },
    {
      q: 'How is XP and rank progression calculated?',
      a: 'Every completed room task awards 50 XP, completed rooms award up to 350 XP, and daily CTF challenges grant bonus experience. Rank titles promote automatically at 1,000 XP milestones.'
    },
    {
      q: 'Are my platform settings and lab progress saved if I close the browser?',
      a: 'Yes. All room submissions, theme modes, terminal preferences, and cleared badges are persisted locally in your browser storage and can be exported as portable JSON at any time.'
    },
    {
      q: 'Can I connect my own Kali Linux machine to the labs?',
      a: 'Yes! Navigate to the LAB CONNECTIVITY tab in the sidebar to download your custom OpenVPN configuration file and connect directly to the 10.10.x.x virtual subnet.'
    }
  ];

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    showToast('BUG REPORT & FEEDBACK TRANSMITTED');
    setFeedbackText('');
    setShowFeedbackModal(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Help & Support Grid */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-5 shadow-sm">
        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-3">
          <HelpCircle size={14} />
          OPERATIVE SUPPORT & TECHNICAL DOCUMENTATION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#111111] dark:text-white font-bold uppercase text-[11px]">
                <Book size={14} />
                <span>LEARNING GUIDE</span>
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Foundational curriculum handbook and roadmap progression strategies.
              </p>
            </div>
            <a
              href="#/paths"
              className="text-[10px] text-[#111111] dark:text-white font-bold flex items-center gap-1 hover:underline"
            >
              <span>VIEW GUIDE →</span>
            </a>
          </div>

          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#111111] dark:text-white font-bold uppercase text-[11px]">
                <Terminal size={14} />
                <span>LAB & VPN GUIDE</span>
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                OpenVPN setup instructions, routing guides, and troubleshooting tips.
              </p>
            </div>
            <a
              href="#/vpn"
              className="text-[10px] text-[#111111] dark:text-white font-bold flex items-center gap-1 hover:underline"
            >
              <span>VPN MANUAL →</span>
            </a>
          </div>

          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#111111] dark:text-white font-bold uppercase text-[11px]">
                <MessageSquare size={14} />
                <span>REPORT A PROBLEM</span>
              </div>
              <p className="text-[10px] text-[#666666] dark:text-[#888888] font-sans">
                Submit bug reports, broken container flags, or task correction tickets.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowFeedbackModal(true)}
              className="text-[10px] text-[#111111] dark:text-white font-bold flex items-center gap-1 hover:underline text-left"
            >
              <span>OPEN TICKET →</span>
            </button>
          </div>

          <div className="p-4 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] flex flex-col justify-between space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#111111] dark:text-white font-bold uppercase text-[11px]">
                <Shield size={14} />
                <span>SYSTEM STATUS</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
            <span className="text-[9px] text-[#888888] dark:text-[#777777] font-mono">
              Core API • VPN • Containers
            </span>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold text-[#888888] dark:text-[#777777] tracking-wider block">
            FREQUENTLY ASKED QUESTIONS (FAQ)
          </span>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#101010] overflow-hidden text-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-3 flex items-center justify-between gap-2 text-left font-bold text-[#111111] dark:text-white hover:bg-[#F0F0F0] dark:hover:bg-[#181818] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isExpanded && (
                    <div className="p-3 pt-0 text-[11px] text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed border-t border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About CyberPath Card */}
      <div className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center font-extrabold text-sm">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base text-[#111111] dark:text-white font-heading uppercase tracking-wider">
                  NETWORKING OS LAB PLATFORM
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#202020] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white font-bold">
                  v1.0.0
                </span>
              </div>
              <p className="text-[10px] text-[#888888] dark:text-[#777777] font-mono tracking-widest uppercase">
                "Learn. Practice. Solve. Secure."
              </p>
            </div>
          </div>

          <div className="text-[10px] text-[#888888] dark:text-[#777777] font-mono text-left sm:text-right">
            <span>BUILD: 2026.08.25-PROD</span>
            <span className="block">ENGINE: REACT 19 + VITE 6</span>
          </div>
        </div>

        <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
          Networking OS Lab is a next-generation cybersecurity learning and tactical simulation platform. Designed for security researchers, ethical hackers, SOC analysts, and network defenders to master offensive operations and blue-team defense in isolated container environments.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
          <button
            type="button"
            onClick={() => showToast('Terms of Service: Authorized educational lab use only.', 'info')}
            className="p-2 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center font-bold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white"
          >
            TERMS OF SERVICE
          </button>
          <button
            type="button"
            onClick={() => showToast('Privacy Policy: All telemetry is stored locally on this machine.', 'info')}
            className="p-2 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center font-bold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white"
          >
            PRIVACY POLICY
          </button>
          <button
            type="button"
            onClick={() => showToast('Open Source Licenses: MIT, Lucide, Tailwind, Framer Motion.', 'info')}
            className="p-2 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center font-bold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white"
          >
            OPEN SOURCE LICENSES
          </button>
          <button
            type="button"
            onClick={() => setShowShortcuts(true)}
            className="p-2 rounded bg-[#FAFAFA] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] text-center font-bold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white"
          >
            SHORTCUTS CHEAT SHEET
          </button>
        </div>
      </div>

      {/* Problem Report Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none font-mono">
          <div className="w-full max-w-md rounded-md bg-white dark:bg-[#141414] border border-[#E5E5E5] dark:border-[#2A2A2A] shadow-2xl p-6 space-y-4">
            <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider font-mono">
              REPORT A PROBLEM OR LAB DEFECT
            </h3>
            <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans">
              Describe the issue encountered during room execution or terminal commands.
            </p>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Provide defect details or container ID..."
              className="w-full bg-[#F7F7F7] dark:bg-[#101010] border border-[#E5E5E5] dark:border-[#2A2A2A] rounded p-2.5 text-xs text-[#111111] dark:text-white outline-none focus:border-[#111111] dark:focus:border-white font-mono resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="btn-cyber-secondary text-xs py-2 px-3 flex-1"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSendFeedback}
                className="btn-cyber-primary text-xs py-2 px-3 flex-1"
              >
                TRANSMIT TICKET
              </button>
            </div>
          </div>
        </div>
      )}

      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
