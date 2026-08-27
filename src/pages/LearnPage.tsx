import { Link } from 'react-router-dom';
import { learningPaths, rooms } from '@/data/cyberpathData';
import { useCyberPath } from '@/context/CyberPathContext';
import { Compass, CheckCircle2, ChevronRight, Clock, Award } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function LearnPage() {
  const { completedRooms, completedTasks } = useCyberPath();

  const pathModules: Record<string, { id: string; title: string; roomId?: string; description: string }[]> = {
    'cybersecurity-foundations': [
      { id: 'm1', title: 'Cyber Fundamentals & Security Principles', roomId: 'cyber-fundamentals', description: 'Core CIA triad, authentication fundamentals, and access controls.' },
      { id: 'm2', title: 'Networking Fundamentals & OSI Stack', roomId: 'networking-basics', description: 'TCP/IP architecture, IP routing, ports, protocols, and subnet masks.' },
      { id: 'm3', title: 'Linux Command Line Administration', roomId: 'linux-fundamentals', description: 'File systems, permissions, grep, process management, and bash shell.' },
      { id: 'm4', title: 'Network Reconnaissance with Nmap', roomId: 'nmap-fundamentals', description: 'Port scanning, service enumeration, OS detection, and NSE scripting engine.' }
    ],
    'web-application-security': [
      { id: 'w1', title: 'Burp Suite Intercept Proxy Basics', roomId: 'burp-suite-basics', description: 'Capturing, modifying, and replaying HTTP requests and analyzing responses.' },
      { id: 'w2', title: 'SQL Injection Exploitation & Defense', roomId: 'sql-injection-fundamentals', description: 'Authentication bypass, union-based extraction, and parameterized query defense.' },
      { id: 'w3', title: 'Cross-Site Scripting (XSS) Vulnerabilities', roomId: 'cross-site-scripting', description: 'Stored, reflected, and DOM-based JavaScript injection in web clients.' },
      { id: 'w4', title: 'OWASP Top 10 Web Auditing', roomId: 'web-fundamentals', description: 'Identification of broken access control, SSRF, and security misconfigurations.' }
    ],
    'offensive-operations': [
      { id: 'o1', title: 'Network Enumeration & Service Probing', roomId: 'nmap-fundamentals', description: 'High-speed host discovery and script scanning against live infrastructure.' },
      { id: 'o2', title: 'Privilege Escalation Fundamentals', roomId: 'linux-fundamentals', description: 'SUID binaries, sudo misconfigurations, cron job hijacking, and kernel exploits.' },
      { id: 'o3', title: 'Exploitation & Capture-The-Flag Strategy', roomId: 'burp-suite-basics', description: 'Formulating multi-stage attack chains to capture flags on target hosts.' }
    ],
    'defensive-soc-forensics': [
      { id: 'd1', title: 'Network PCAP Traffic Dissection with Wireshark', roomId: 'network-traffic-wireshark', description: 'Deep packet inspection, protocol filtering, and suspicious flow discovery.' },
      { id: 'd2', title: 'SOC Log Analysis & SIEM Triage', roomId: 'soc-log-analysis', description: 'Parsing auth.log, apache access logs, and identifying threat indicators.' },
      { id: 'd3', title: 'SSH Brute Force Threat Detection', roomId: 'ssh-brute-force-defense', description: 'Detecting credential stuffing and configuring IP banning via fail2ban.' }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 select-none font-mono pb-8">
      {/* Header with Breadcrumb & Purpose (Rule 10, 24, 25) */}
      <div className="border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-6 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#888888] dark:text-[#777777] uppercase tracking-widest">
          <Compass size={13} className="text-[#111111] dark:text-white" />
          <span>CYBERPATH // STRUCTURED CAREER PATHWAYS</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-white font-heading tracking-tight uppercase">
          CYBERSECURITY LEARNING PATHS
        </h1>
        <p className="text-xs sm:text-sm text-[#555555] dark:text-[#B5B5B5] font-sans max-w-2xl leading-relaxed">
          Structured step-by-step educational curricula. Each path guides you from core principles to hands-on interactive labs and live targets.
        </p>
      </div>

      {/* Learning Paths List */}
      <div className="space-y-6">
        {learningPaths.map((path) => {
          const modules = pathModules[path.id] || [];
          const pathRooms = rooms.filter(r => path.roomIds.includes(r.id));
          const completedPathRooms = pathRooms.filter(r => completedRooms.includes(r.id)).length;
          const pathProgressPct = pathRooms.length > 0 ? Math.round((completedPathRooms / pathRooms.length) * 100) : 0;
          const firstUnfinishedRoom = pathRooms.find(r => !completedRooms.includes(r.id)) || pathRooms[0];

          return (
            <div 
              key={path.id} 
              className="p-6 sm:p-7 rounded-md border border-[#E5E5E5] dark:border-[#2A2A2A] bg-white dark:bg-[#141414] space-y-6 shadow-sm"
            >
              {/* Path Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E5E5] dark:border-[#2A2A2A] pb-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[#111111] dark:text-white uppercase">
                      {path.difficulty}
                    </span>
                    <span className="text-[10px] text-[#888888] dark:text-[#777777] font-bold flex items-center gap-1">
                      <Clock size={11} /> {path.estimatedTime}
                    </span>
                    <span className="text-[10px] text-[#111111] dark:text-white font-bold flex items-center gap-1">
                      <Award size={11} /> +{path.xpReward} XP
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white font-heading uppercase tracking-tight">
                    {path.title}
                  </h2>
                </div>

                {/* ONE Obvious Path CTA (Rule 11) */}
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/labs/${firstUnfinishedRoom?.id || 'nmap-fundamentals'}`}
                    className="btn-cyber-primary text-xs py-2.5 px-6"
                  >
                    <span>{pathProgressPct > 0 ? 'CONTINUE PATH →' : 'START PATH →'}</span>
                  </Link>
                </div>
              </div>

              {/* Path Description & Progress */}
              <div className="space-y-3">
                <p className="text-xs text-[#555555] dark:text-[#B5B5B5] font-sans leading-relaxed">
                  {path.description}
                </p>

                <div className="space-y-1 pt-1 max-w-md">
                  <div className="flex justify-between text-xs font-bold text-[#111111] dark:text-white">
                    <span className="text-[10px] uppercase text-[#888888] dark:text-[#777777]">PATH PROGRESS</span>
                    <span>{completedPathRooms} / {pathRooms.length} MODULES ({pathProgressPct}%)</span>
                  </div>
                  <ProgressBar value={pathProgressPct} size="sm" />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {path.skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-2 py-0.5 rounded bg-[#F7F7F7] dark:bg-[#181818] border border-[#E5E5E5] dark:border-[#2A2A2A] text-[10px] text-[#555555] dark:text-[#B5B5B5] uppercase font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Modules Breakdown Section (Rule 10 & 11) */}
              <div className="space-y-3 pt-3 border-t border-[#E5E5E5] dark:border-[#2A2A2A]">
                <span className="text-[10px] font-bold uppercase text-[#888888] dark:text-[#777777] tracking-widest block">
                  CURRICULUM MODULES & PRACTICAL STAGES ({modules.length})
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {modules.map((mod, idx) => {
                    const isRoomDone = mod.roomId ? completedRooms.includes(mod.roomId) : false;
                    const roomObj = mod.roomId ? rooms.find(r => r.id === mod.roomId) : null;
                    const tasksDone = roomObj ? roomObj.tasks.filter(t => completedTasks.has(t.id)).length : 0;

                    return (
                      <Link
                        key={mod.id}
                        to={mod.roomId ? `/labs/${mod.roomId}` : '#'}
                        className="p-3.5 rounded border border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#FAFAFA] dark:bg-[#181818] hover:border-[#111111] dark:hover:border-white transition-all flex items-start justify-between gap-3 group"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#888888] dark:text-[#777777]">
                              0{idx + 1}.
                            </span>
                            <h4 className="font-bold text-xs text-[#111111] dark:text-white uppercase font-heading group-hover:underline truncate">
                              {mod.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-[#666666] dark:text-[#999999] font-sans line-clamp-2">
                            {mod.description}
                          </p>
                          {roomObj && (
                            <span className="text-[9px] text-[#888888] dark:text-[#777777] block font-mono mt-1">
                              Tasks: {tasksDone}/{roomObj.tasks.length} Done
                            </span>
                          )}
                        </div>

                        <div className="shrink-0 flex items-center pt-1">
                          {isRoomDone ? (
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <ChevronRight size={14} className="text-[#888888] dark:text-[#777777] group-hover:translate-x-0.5 transition-transform" />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
