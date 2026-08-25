import { Link } from 'react-router-dom';
import { learningPaths, rooms } from '@/data/cyberpathData';
import { Compass, Terminal } from 'lucide-react';

export function LearningPathsPage() {
  const pathModules: Record<string, string[]> = {
    'cybersecurity-foundations': [
      '01 Introduction to Cybersecurity',
      '02 Networking Fundamentals',
      '03 OSI & TCP/IP',
      '04 IP Addressing',
      '05 Subnetting',
      '06 Linux Fundamentals',
      '07 Web Fundamentals',
      '08 Security Fundamentals',
      '09 Practical Networking Lab'
    ],
    'web-application-security': [
      '01 HTTP Protocol Analysis',
      '02 Cookie & Session Management',
      '03 SQL Injection (SQLi)',
      '04 Cross-Site Scripting (XSS)',
      '05 OWASP Top 10 Auditing',
      '06 Web Reconnaissance & Fuzzing'
    ],
    'offensive-operations': [
      '01 Active Reconnaissance with Nmap',
      '02 Vulnerability Scanning',
      '03 Burp Suite Intercept Proxy',
      '04 SUID Binary Privilege Escalation',
      '05 Flag Capture Exploitation'
    ],
    'defensive-soc-forensics': [
      '01 Network PCAP Traffic Analysis',
      '02 Wireshark Packet Dissection',
      '03 SIEM Log Analysis',
      '04 SSH Brute Force Detection'
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono">
      {/* Header */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest mb-1">
          <Compass size={14} className="text-[#111111] dark:text-white" />
          <span>STRUCTURED CAREER PATHWAYS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          CYBERSECURITY LEARNING PATHS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-2xl leading-relaxed">
          Structured step-by-step career learning paths. Each path combines core theory, hands-on terminal rooms, and practical labs.
        </p>
      </div>

      {/* Learning Paths List */}
      <div className="space-y-6">
        {learningPaths.map((path) => {
          const pathRooms = rooms.filter(r => path.roomIds.includes(r.id));
          const modules = pathModules[path.id] || [];

          return (
            <div key={path.id} className="p-6 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
                      {path.difficulty}
                    </span>
                    <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold">
                      {path.estimatedTime}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                    {path.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#111111] dark:text-white">
                    +{path.xpReward} XP
                  </span>
                  <Link
                    to={`/rooms/${pathRooms[0]?.id || 'nmap-fundamentals'}`}
                    className="btn-cyber-primary text-xs py-2.5 px-5"
                  >
                    <span>START PATH →</span>
                  </Link>
                </div>
              </div>

              <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                {path.description}
              </p>

              {/* Modules Breakdown List */}
              <div className="space-y-3 pt-2">
                <span className="text-[10px] font-bold uppercase text-[#888888] dark:text-[#777777] tracking-widest block">
                  CURRICULUM MODULES & PRACTICAL STAGES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {modules.map((m) => (
                    <div key={m} className="p-3 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white font-bold flex items-center gap-2">
                      <Terminal size={13} className="text-[#111111] dark:text-white shrink-0" />
                      <span className="truncate">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
