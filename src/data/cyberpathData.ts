export interface LearningPath {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  roomsCount: number;
  xpReward: number;
  skills: string[];
  description: string;
  roomIds: string[];
}

export interface RoomTask {
  id: string;
  title: string;
  description: string;
  question: string;
  answer: string;
  hint: string;
  points: number;
  isTerminal?: boolean;
  isWebLab?: boolean;
  isPacketLab?: boolean;
  targetIp?: string;
}

export interface Room {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  xp: number;
  description: string;
  tasks: RoomTask[];
  skills: string[];
  duration: string;
  category: 'Linux' | 'Networking' | 'Web Security' | 'Threat & Defense' | 'Forensics';
  labToolId?: string;
  isWebLab?: boolean;
  isPacketLab?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp: number;
  category: string;
  description: string;
  hint: string;
  answer: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  roomsCompleted: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface DailyMission {
  question: string;
  options?: string[];
  answer: string;
  xp: number;
  hint: string;
  explanation: string;
}

// ─── LEARNING PATHS ───
export const learningPaths: LearningPath[] = [
  {
    id: 'cybersecurity-foundations',
    title: 'Cybersecurity Foundations',
    difficulty: 'Beginner',
    estimatedTime: '20 Hours',
    roomsCount: 4,
    xpReward: 2000,
    skills: ['Cyber Fundamentals', 'Networking Principles', 'Linux Command Line', 'Network Reconnaissance'],
    description: 'Master the core bedrock of practical cybersecurity. Learn how computers talk over network protocols, execute Linux terminal commands, and perform host enumeration.',
    roomIds: ['cyber-fundamentals', 'networking-basics', 'linux-fundamentals', 'nmap-fundamentals']
  },
  {
    id: 'web-application-security',
    title: 'Web Application Security & Pentesting',
    difficulty: 'Intermediate',
    estimatedTime: '24 Hours',
    roomsCount: 4,
    xpReward: 3500,
    skills: ['HTTP Request Analysis', 'SQL Injection', 'Cross-Site Scripting (XSS)', 'Proxy Interception'],
    description: 'Audit and exploit web applications inside controlled virtual sandboxes. Learn how web servers process HTTP traffic, extract database credentials, and neutralize injection attacks.',
    roomIds: ['web-fundamentals', 'http-request-analysis', 'sqli-tester', 'xss-playground']
  },
  {
    id: 'offensive-operations',
    title: 'Offensive Security & Red Teaming',
    difficulty: 'Intermediate',
    estimatedTime: '26 Hours',
    roomsCount: 2,
    xpReward: 3000,
    skills: ['Interception Proxies', 'Privilege Escalation', 'System Audit', 'Flag Capture'],
    description: 'Learn the exact methodologies used by penetration testers to intercept requests, inspect local binaries, and escalate privileges from standard user to root.',
    roomIds: ['burp-suite-basics', 'privilege-escalation']
  },
  {
    id: 'defensive-soc-forensics',
    title: 'Defensive Security & SOC Operations',
    difficulty: 'Intermediate',
    estimatedTime: '22 Hours',
    roomsCount: 2,
    xpReward: 2800,
    skills: ['Packet Captures', 'SOC Telemetry', 'Log Auditing', 'SIEM Monitoring'],
    description: 'Protect enterprise infrastructure by dissecting raw network packet captures (PCAP) and analyzing SIEM alert telemetry during active breach investigations.',
    roomIds: ['wireshark-packet-analysis', 'soc-log-investigation']
  }
];

// ─── 12 PRACTICAL CYBERSECURITY ROOMS ───
export const rooms: Room[] = [
  {
    id: 'cyber-fundamentals',
    title: 'Cybersecurity Fundamentals',
    difficulty: 'Easy',
    xp: 400,
    description: 'Understand core security models, the CIA triad, threat actors, and security terminology in real-world infrastructure.',
    category: 'Linux',
    duration: '1.5 Hours',
    skills: ['CIA Triad', 'Threat Classification', 'Security Principles'],
    tasks: [
      {
        id: 'cf-task-1',
        title: 'The CIA Triad',
        description: 'Understand Confidentiality, Integrity, and Availability in production environments.',
        question: 'Which component of the CIA triad ensures that data has not been altered or tampered with?',
        answer: 'Integrity',
        hint: 'It begins with the letter I and stands for data trustworthiness.',
        points: 50
      },
      {
        id: 'cf-task-2',
        title: 'Authentication & Access Controls',
        description: 'Identify multi-factor authentication (MFA) mechanisms and zero-trust security postures.',
        question: 'What security model assumes no device or user is inherently trusted even inside the perimeter network?',
        answer: 'Zero Trust',
        hint: 'Think "Never Trust, Always Verify".',
        points: 100
      },
      {
        id: 'cf-task-3',
        title: 'First Security Terminal Audit',
        description: 'Launch your first simulated terminal to inspect security policy documentation.',
        question: 'Use cat on notes.txt inside the terminal to read the security policy flag.',
        answer: 'CP{SECURITY_FOUNDATIONS_VERIFIED}',
        hint: 'Start the lab, open terminal, and run "cat notes.txt".',
        points: 150,
        isTerminal: true,
        targetIp: '10.10.10.5'
      }
    ]
  },
  {
    id: 'networking-basics',
    title: 'Networking Basics',
    difficulty: 'Easy',
    xp: 500,
    description: 'Learn how packets travel across subnets, MAC addresses, IP addressing, and default port numbers.',
    category: 'Networking',
    duration: '2 Hours',
    skills: ['OSI Model', 'IP Subnetting', 'TCP/UDP Protocols'],
    labToolId: 'subnet',
    tasks: [
      {
        id: 'netb-task-1',
        title: 'The OSI 7-Layer Model',
        description: 'Understand how protocols interact from Physical layer up to Application layer.',
        question: 'Which layer of the OSI model is responsible for routing packets across IP networks (Layer 3)?',
        answer: 'Network Layer',
        hint: 'Layer 3 handles IP routing across hosts.',
        points: 50
      },
      {
        id: 'netb-task-2',
        title: 'Subnet Mask Calculation',
        description: 'Calculate standard IPv4 subnet bit allocations.',
        question: 'How many usable host IP addresses are available in a standard /24 IPv4 subnet?',
        answer: '254',
        hint: '2^8 - 2 (subtracting network and broadcast addresses) = 254.',
        points: 100
      },
      {
        id: 'netb-task-3',
        title: 'Default Service Ports',
        description: 'Recall the standard network port assignments used by web servers and file protocols.',
        question: 'What is the default port used by encrypted HTTPS traffic?',
        answer: '443',
        hint: 'Standard SSL/TLS web traffic runs on port 443.',
        points: 100
      }
    ]
  },
  {
    id: 'linux-fundamentals',
    title: 'Linux Fundamentals',
    difficulty: 'Easy',
    xp: 500,
    description: 'Master essential Linux command line navigation, privilege escalation concepts, and terminal file manipulation.',
    category: 'Linux',
    duration: '2 Hours',
    skills: ['Terminal Commands', 'File Management', 'Sudo Permissions'],
    tasks: [
      {
        id: 'linux-task-1',
        title: 'Terminal Navigation & Identity',
        description: 'Inspect active shell identity using standard GNU coreutils.',
        question: 'What is the username returned by running whoami in the lab terminal?',
        answer: 'cyberpath_explorer',
        hint: 'Click START LAB, open terminal, and run "whoami".',
        points: 50,
        isTerminal: true,
        targetIp: '10.10.10.5'
      },
      {
        id: 'linux-task-2',
        title: 'Listing & Reading Hidden Flags',
        description: 'Practice directory listing and reading file contents in Linux.',
        question: 'What flag is stored inside flag.txt in the current directory?',
        answer: 'FLAG{CYBERPATH_LINUX_CHAMP}',
        hint: 'Run "ls -la" then "cat flag.txt".',
        points: 100,
        isTerminal: true,
        targetIp: '10.10.10.5'
      },
      {
        id: 'linux-task-3',
        title: 'Inspecting Subdirectories',
        description: 'Navigate into subdirectories and inspect hidden credential files.',
        question: 'What is the secret password listed inside credentials.txt inside the scans directory?',
        answer: 'cyberpath123',
        hint: 'Run "cat scans/credentials.txt".',
        points: 150,
        isTerminal: true,
        targetIp: '10.10.10.5'
      }
    ]
  },
  {
    id: 'nmap-fundamentals',
    title: 'Nmap & Network Recon',
    difficulty: 'Easy',
    xp: 600,
    description: 'Perform active network host discovery, port scanning, and service version enumeration using Nmap.',
    category: 'Networking',
    duration: '2.5 Hours',
    skills: ['Active Reconnaissance', 'Port Scanning', 'Service Discovery'],
    tasks: [
      {
        id: 'nmap-task-1',
        title: 'Port Scanning Theory',
        description: 'Discover how SYN scanning and TCP handshake probes detect open listening sockets.',
        question: 'What standard port is used by SSH for secure terminal access?',
        answer: '22',
        hint: 'SSH uses port 22.',
        points: 50
      },
      {
        id: 'nmap-task-2',
        title: 'Scanning Target IP 10.10.20.15',
        description: 'Execute an Nmap port scan against target machine 10.10.20.15 in the browser terminal.',
        question: 'How many TCP ports are found open on host 10.10.20.15?',
        answer: '4',
        hint: 'Run "nmap 10.10.20.15" in the terminal and count the listed open ports (22, 80, 443, 3306).',
        points: 150,
        isTerminal: true,
        targetIp: '10.10.20.15'
      },
      {
        id: 'nmap-task-3',
        title: 'Database Service Enumeration',
        description: 'Identify the exact database service running on port 3306.',
        question: 'What service is listening on port 3306 on target 10.10.20.15?',
        answer: 'mysql',
        hint: 'Check the output of nmap 10.10.20.15 for port 3306/tcp.',
        points: 150,
        isTerminal: true,
        targetIp: '10.10.20.15'
      },
      {
        id: 'nmap-task-4',
        title: 'Web Recon & Banner Grabbing',
        description: 'Execute a HTTP GET request on the target web server using curl.',
        question: 'Curl http://10.10.20.15 to extract the web flag hidden in the HTML comment.',
        answer: 'FLAG{NMAP_WEB_RECON_SUCCESS}',
        hint: 'Run "curl 10.10.20.15" in the terminal.',
        points: 200,
        isTerminal: true,
        targetIp: '10.10.20.15'
      }
    ]
  },
  {
    id: 'web-fundamentals',
    title: 'Web Fundamentals',
    difficulty: 'Easy',
    xp: 500,
    description: 'Learn how web browsers render web applications, process HTML, CSS, JavaScript, and cookie tokens.',
    category: 'Web Security',
    duration: '2 Hours',
    skills: ['DOM Structure', 'HTTP Client/Server', 'Session Cookies'],
    isWebLab: true,
    tasks: [
      {
        id: 'wf-task-1',
        title: 'Understanding HTTP Client Requests',
        description: 'Identify request verbs like GET, POST, PUT, and DELETE.',
        question: 'Which HTTP method is standard for submitting form credentials to a server?',
        answer: 'POST',
        hint: 'Form submissions use POST requests.',
        points: 50
      },
      {
        id: 'wf-task-2',
        title: 'Inspecting Web Application Elements',
        description: 'Open the simulated target web application container to investigate client HTML.',
        question: 'Open the Target Web App. What flag is hidden in the web page comment header?',
        answer: 'CP{HTTP_HEADER_ANALYSIS_PRO}',
        hint: 'Launch the lab web view and check the target web container status.',
        points: 150,
        isWebLab: true,
        targetIp: '10.10.30.8'
      }
    ]
  },
  {
    id: 'http-request-analysis',
    title: 'HTTP & Request Analysis',
    difficulty: 'Medium',
    xp: 700,
    description: 'Deconstruct raw HTTP request headers, response status codes, User-Agent strings, and authentication bearer tokens.',
    category: 'Web Security',
    duration: '2.5 Hours',
    skills: ['Header Parsing', 'HTTP Status Codes', 'Session Tokens'],
    labToolId: 'http',
    tasks: [
      {
        id: 'http-task-1',
        title: 'Status Code Classification',
        description: 'Identify HTTP response status categories (2xx, 3xx, 4xx, 5xx).',
        question: 'What 3-digit status code indicates a resource was NOT FOUND on the server?',
        answer: '404',
        hint: 'Standard HTTP error code for missing pages is 404.',
        points: 50
      },
      {
        id: 'http-task-2',
        title: 'Security Header Auditing',
        description: 'Analyze security headers like Content-Security-Policy and Strict-Transport-Security.',
        question: 'Which response header enforces browser HTTPS encryption for domain connections?',
        answer: 'Strict-Transport-Security',
        hint: 'Also known as HSTS.',
        points: 150
      }
    ]
  },
  {
    id: 'sqli-tester',
    title: 'SQL Injection Lab',
    difficulty: 'Medium',
    xp: 1000,
    description: 'Understand database query vulnerabilities, bypass authentication screens, and extract UNION query flags.',
    category: 'Web Security',
    duration: '3 Hours',
    skills: ['SQL Syntax', 'UNION Attacks', 'Authentication Bypass'],
    labToolId: 'sqli',
    isWebLab: true,
    tasks: [
      {
        id: 'sqli-task-1',
        title: 'Authentication Bypass Logic',
        description: 'Inject a boolean true single-quote payload into the username login input.',
        question: 'What payload forces a SQL query clause to evaluate true regardless of password (e.g. admin\' OR \'1\'=\'1)? Submit the flag awarded upon successful bypass.',
        answer: 'CP{SQLI_UNION_BYPASS_COMPLETE}',
        hint: 'Use the SQL Injection sandbox tab or type "admin\' OR \'1\'=\'1" in the login demo.',
        points: 200,
        isWebLab: true,
        targetIp: '10.10.40.12'
      }
    ]
  },
  {
    id: 'xss-playground',
    title: 'XSS Fundamentals',
    difficulty: 'Medium',
    xp: 900,
    description: 'Execute Reflected and Stored Cross-Site Scripting (XSS) in client inputs to extract session cookies.',
    category: 'Web Security',
    duration: '3 Hours',
    skills: ['DOM Injection', 'HTML Sanitization', 'Cookie Theft'],
    labToolId: 'xss',
    isWebLab: true,
    tasks: [
      {
        id: 'xss-task-1',
        title: 'Reflected Script Injection',
        description: 'Construct a basic script alert payload to execute inside the DOM sandbox container.',
        question: 'Inject <script>alert(1)</script> into the target input. What flag is generated in the console logger?',
        answer: 'CP{DOM_XSS_PAYLOAD_SUCCESS}',
        hint: 'Submit <script>alert(1)</script> in the XSS lab playground.',
        points: 200,
        isWebLab: true,
        targetIp: '10.10.50.22'
      }
    ]
  },
  {
    id: 'burp-suite-basics',
    title: 'Burp Suite Basics',
    difficulty: 'Medium',
    xp: 1000,
    description: 'Master HTTP proxy intercept tools. Intercept, inspect, modify, and repeat web requests using virtual proxies.',
    category: 'Web Security',
    duration: '3 Hours',
    skills: ['Proxy Intercept', 'Repeater Tool', 'Header Manipulation'],
    labToolId: 'http',
    tasks: [
      {
        id: 'burp-task-1',
        title: 'Intercepting Traffic',
        description: 'Capture outbound requests using Burp Proxy before they reach the web server.',
        question: 'What key tab in Burp Suite is used to manually re-send and test modified requests?',
        answer: 'Repeater',
        hint: 'Burp Repeater allows replaying requests.',
        points: 100
      }
    ]
  },
  {
    id: 'wireshark-packet-analysis',
    title: 'Wireshark Packet Analysis',
    difficulty: 'Medium',
    xp: 1100,
    description: 'Inspect raw PCAP network captures, analyze TCP 3-way handshakes, and follow unencrypted stream credentials.',
    category: 'Forensics',
    duration: '3.5 Hours',
    skills: ['PCAP Analysis', 'TCP Handshake', 'Display Filters'],
    isPacketLab: true,
    tasks: [
      {
        id: 'pcap-task-1',
        title: 'TCP 3-Way Handshake Flags',
        description: 'Identify the exact order of TCP flags transmitted during connection establishment.',
        question: 'What sequence of TCP flag packets establishes a connection (e.g. SYN, SYN-ACK, ACK)?',
        answer: 'SYN, SYN-ACK, ACK',
        hint: 'SYN -> SYN-ACK -> ACK.',
        points: 100
      },
      {
        id: 'pcap-task-2',
        title: 'Inspecting Unencrypted Streams',
        description: 'Filter Wireshark traffic for HTTP credentials in plaintext.',
        question: 'What display filter is typed in Wireshark to filter only HTTP GET and POST requests?',
        answer: 'http',
        hint: 'Type "http" into the display filter bar.',
        points: 150,
        isPacketLab: true
      }
    ]
  },
  {
    id: 'privilege-escalation',
    title: 'Privilege Escalation Fundamentals',
    difficulty: 'Hard',
    xp: 1200,
    description: 'Identify SUID binaries, misconfigured sudo rules, and escalate standard user privileges to root access.',
    category: 'Linux',
    duration: '4 Hours',
    skills: ['SUID Binaries', 'Sudo Abuses', 'Root Privilege Escalation'],
    tasks: [
      {
        id: 'pe-task-1',
        title: 'Auditing SUID Permissions',
        description: 'Find binaries with the SUID bit set on Linux filesystems.',
        question: 'What Linux command flag checks for file permissions with bit mask 4000 (SUID)?',
        answer: '-perm -4000',
        hint: 'find / -perm -4000 2>/dev/null.',
        points: 150,
        isTerminal: true,
        targetIp: '10.10.10.5'
      }
    ]
  },
  {
    id: 'soc-log-investigation',
    title: 'SOC Log Investigation',
    difficulty: 'Hard',
    xp: 1300,
    description: 'Investigate enterprise SIEM syslog alerts, correlate brute force login attempts, and trace malicious IP origins.',
    category: 'Threat & Defense',
    duration: '4 Hours',
    skills: ['Syslog Analysis', 'Brute Force Detection', 'SIEM Telemetry'],
    tasks: [
      {
        id: 'soc-task-1',
        title: 'Detecting SSH Brute Force Attacks',
        description: 'Analyze auth.log records to identify malicious IP addresses attempting automated SSH authentication.',
        question: 'What auth.log keyword indicates a failed password authentication attempt?',
        answer: 'Failed password',
        hint: 'Look for lines containing "Failed password for root".',
        points: 150
      }
    ]
  }
];

export const challenges: Challenge[] = [
  {
    id: 'port-detective',
    title: 'Port Detective',
    difficulty: 'Easy',
    xp: 100,
    category: 'Networking',
    description: 'A remote server has an encrypted terminal listener active. What service standard port is 22?',
    hint: 'Think SSH.',
    answer: 'SSH'
  },
  {
    id: 'injection-inspection',
    title: 'Injection Inspection',
    difficulty: 'Easy',
    xp: 100,
    category: 'Web Security',
    description: 'What single character is typed first by security analysts to test if SQL queries are unescaped?',
    hint: 'Single quotation mark / apostrophe.',
    answer: "'"
  },
  {
    id: 'super-user',
    title: 'Super User',
    difficulty: 'Easy',
    xp: 100,
    category: 'Linux',
    description: 'What command prefix executes Linux commands with administrative superuser root permissions?',
    hint: 'SuperUser DO.',
    answer: 'sudo'
  }
];

export const badges: Badge[] = [
  {
    id: 'first-blood',
    title: 'First Blood',
    description: 'Complete your first virtual lab task successfully.',
    xpReward: 100,
    icon: 'Trophy'
  },
  {
    id: 'network-explorer',
    title: 'Network Explorer',
    description: 'Complete all networking lab tasks.',
    xpReward: 250,
    icon: 'Globe'
  },
  {
    id: 'linux-rookie',
    title: 'Linux Rookie',
    description: 'Complete the entire Linux Fundamentals room.',
    xpReward: 200,
    icon: 'Terminal'
  },
  {
    id: 'web-hunter',
    title: 'Web Hunter',
    description: 'Solve your first web vulnerability lab.',
    xpReward: 150,
    icon: 'Bug'
  },
  {
    id: 'streak-warrior',
    title: '7 Day Warrior',
    description: 'Maintain a 7-day training streak.',
    xpReward: 300,
    icon: 'Flame'
  }
];

export const defaultLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'CyberWolf', level: 12, xp: 12450, roomsCompleted: 12, badgesCount: 6 },
  { rank: 2, username: 'NullByte', level: 11, xp: 11200, roomsCompleted: 11, badgesCount: 5 },
  { rank: 3, username: 'ShadowRoot', level: 10, xp: 9850, roomsCompleted: 10, badgesCount: 5 },
  { rank: 4, username: 'CyberNinja', level: 9, xp: 8700, roomsCompleted: 9, badgesCount: 4 },
  { rank: 5, username: 'SecGeek', level: 8, xp: 7200, roomsCompleted: 8, badgesCount: 4 },
  { rank: 6, username: 'PixelByte', level: 6, xp: 5400, roomsCompleted: 6, badgesCount: 3 },
  { rank: 7, username: 'NetVisor', level: 5, xp: 4100, roomsCompleted: 5, badgesCount: 3 },
  { rank: 8, username: 'RootAccess', level: 4, xp: 3200, roomsCompleted: 4, badgesCount: 2 }
];

export const dailyMissions: DailyMission[] = [
  {
    question: "A security analyst spots network traffic going to port 443. What service is this?",
    options: ["HTTP", "HTTPS", "FTP", "DNS"],
    answer: "HTTPS",
    xp: 50,
    hint: "Port 443 is standard for secure web traffic.",
    explanation: "Port 443 is standard for HTTPS encrypted web requests."
  }
];
