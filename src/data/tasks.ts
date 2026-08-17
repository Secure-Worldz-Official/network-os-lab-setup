export interface Task {
  id: string;
  labId: string;
  description: string;
  hint: string;
  verify: (labOutput: string, labError?: string, timing?: number | null) => boolean;
}

export interface TaskProgress {
  completed: string[];
  total: number;
}

export const subnetTasks: Task[] = [
  {
    id: 'subnet-1',
    labId: 'subnet',
    description: 'Click exactly 24 network bits on the 32-bit grid before revealing results',
    hint: 'The prefix length determines how many network bits there are. Count carefully from left to right.',
    verify: (output) => output.includes('Network:  192.168.1.0'),
  },
  {
    id: 'subnet-2',
    labId: 'subnet',
    description: 'Calculate the broadcast address for 192.168.1.0/24',
    hint: 'Broadcast is the last address in the subnet. Look for the "Broadcast:" line.',
    verify: (output) => output.includes('Broadcast: 192.168.1.255'),
  },
  {
    id: 'subnet-3',
    labId: 'subnet',
    description: 'Verify the usable host range for 192.168.1.0/24',
    hint: 'Usable hosts exclude network and broadcast. Look for the "Usable:" line.',
    verify: (output) => output.includes('Usable:   192.168.1.1 — 192.168.1.254'),
  },
  {
    id: 'subnet-4',
    labId: 'subnet',
    description: 'Identify the IP class for 192.168.1.0',
    hint: 'Look for the "Class:" line. 192.x.x.x falls in Class C.',
    verify: (output) => output.includes('Class:    C'),
  },
  {
    id: 'subnet-5',
    labId: 'subnet',
    description: 'Confirm 192.168.1.0 is a private IP address',
    hint: 'Look for the "Type:" line. RFC 1918 defines 192.168.x.x as private.',
    verify: (output) => output.includes('Type:     Private (RFC 1918)'),
  },
];

export const httpTasks: Task[] = [
  {
    id: 'http-1',
    labId: 'http',
    description: 'Send a GET request and receive a 200 OK response',
    hint: 'Use the default URL and method, then click "Send Request". Look for the status line.',
    verify: (output) => output.includes('200 OK'),
  },
  {
    id: 'http-2',
    labId: 'http',
    description: 'Verify the response contains the Content-Type header',
    hint: 'Look in the response headers section for Content-Type.',
    verify: (output) => output.includes('Content-Type:'),
  },
  {
    id: 'http-3',
    labId: 'http',
    description: 'Confirm the request completed in under 10 seconds',
    hint: 'The timing badge shows elapsed time in milliseconds.',
    verify: (_output: string, _error?: string, timing?: number | null) => timing !== undefined && timing !== null && timing < 10000,
  },
];

export const networkTasks: Task[] = [
  {
    id: 'network-1',
    labId: 'network',
    description: 'Run the network inspection and confirm all 4 sensor panels activate',
    hint: 'Click "Run Scan" and watch the Browser, Network, Local IP, and Connection panels reveal in sequence.',
    verify: (output, error) => !error && output.includes('=== Browser & Environment ===') && output.includes('=== Network Information API ===') && output.includes('=== RTCPeerConnection (Local Candidates) ===') && output.includes('=== Connection State ==='),
  },
  {
    id: 'network-2',
    labId: 'network',
    description: 'Verify your browser platform and language are detected',
    hint: 'Look for the "Platform:" and "Language:" lines in the Browser panel.',
    verify: (output) => output.includes('Platform:') && !output.includes('Platform:         unknown') && output.includes('Language:'),
  },
  {
    id: 'network-3',
    labId: 'network',
    description: 'Confirm your online status and effective connection type are detected',
    hint: 'Look for "Online:" and "Effective Type:" in the Connection and Network panels.',
    verify: (output) => output.includes('Online:') && (output.includes('Online:           yes') || output.includes('Online:           no')) && output.includes('Effective Type:'),
  },
];

export const dnsTasks: Task[] = [
  {
    id: 'dns-1',
    labId: 'dns',
    description: 'Resolve the A record for example.com',
    hint: 'Keep the default domain and record type, then click "Resolve DNS". Look for the Answers section.',
    verify: (output) => output.includes('=== Answers ===') && output.includes('A  TTL='),
  },
  {
    id: 'dns-2',
    labId: 'dns',
    description: 'Verify the DNS query returned NOERROR status',
    hint: 'Look for the "Status:" line near the top of the response.',
    verify: (output) => output.includes('Status:    0 (NOERROR)'),
  },
  {
    id: 'dns-3',
    labId: 'dns',
    description: 'Confirm the resolved IP matches the known address for example.com',
    hint: 'Look in the Answers section for the A record data. The well-known IP for example.com is 93.184.216.34.',
    verify: (output) => output.includes('93.184.216.34'),
  },
];

export const malwareTasks: Task[] = [
  {
    id: 'malware-1',
    labId: 'malware',
    description: 'Classify a ransomware sample based on observed behaviors',
    hint: 'Look for encryption + ransom note + C2 beaconing. Ransomware encrypts files and demands payment.',
    verify: (output) => output.includes('Ransomware'),
  },
  {
    id: 'malware-2',
    labId: 'malware',
    description: 'Classify a worm based on self-replication and network spread',
    hint: 'Worms self-replicate without human interaction and spread across networks automatically.',
    verify: (output) => output.includes('Worm'),
  },
  {
    id: 'malware-3',
    labId: 'malware',
    description: 'Identify the MITRE ATT&CK technique for data encryption',
    hint: 'Look for technique ID T1486 in the classification result.',
    verify: (output) => output.includes('T1486'),
  },
];

export const attackVectorTasks: Task[] = [
  {
    id: 'attack-1',
    labId: 'attack-vector',
    description: 'Identify the attack vector for a phishing email scenario',
    hint: 'An employee opening a malicious attachment from an unknown sender is a classic phishing delivery method.',
    verify: (output) => output.includes('Phishing'),
  },
  {
    id: 'attack-2',
    labId: 'attack-vector',
    description: 'Map the kill chain phase for a supply chain compromise',
    hint: 'Supply chain attacks typically compromise software before it reaches the victim — this happens during Delivery or Installation.',
    verify: (output) => output.includes('Delivery') || output.includes('Installation'),
  },
  {
    id: 'attack-3',
    labId: 'attack-vector',
    description: 'Identify the CVSS 3.1 base score range for a critical unauthenticated RCE',
    hint: 'Critical severity vulnerabilities with network-accessible unauthenticated remote code execution score in the 9.0–10.0 range.',
    verify: (output) => output.includes('9.') || output.includes('10.'),
  },
];

export const socialEngineeringTasks: Task[] = [
  {
    id: 'social-1',
    labId: 'social-eng',
    description: 'Flag the urgency trigger in the phishing message',
    hint: 'Look for time-pressure language like "Act now", "within 24 hours", or "immediate action required".',
    verify: (output) => output.includes('Urgency'),
  },
  {
    id: 'social-2',
    labId: 'social-eng',
    description: 'Flag the authority impersonation indicator',
    hint: 'Look for spoofed sender addresses claiming to be from IT, security, or executive teams.',
    verify: (output) => output.includes('Authority') || output.includes('Impersonation'),
  },
  {
    id: 'social-3',
    labId: 'social-eng',
    description: 'Flag the suspicious URL with domain similarity',
    hint: 'Compare the displayed URL against the real brand domain. Look for typosquatting or character substitution.',
    verify: (output) => output.includes('Domain Similarity') || output.includes('Suspicious URL'),
  },
];

export const xssTasks: Task[] = [
  {
    id: 'xss-1',
    labId: 'xss',
    description: 'Inject a payload that triggers an alert in the sandboxed form',
    hint: 'Try a simple script tag or img onerror payload in the vulnerable input field.',
    verify: (output) => output.includes('XSS_TRIGGERED'),
  },
  {
    id: 'xss-2',
    labId: 'xss',
    description: 'Apply sanitization that blocks the XSS payload',
    hint: 'After triggering XSS, enable the sanitizer. The same payload should no longer execute.',
    verify: (output) => output.includes('XSS_BLOCKED'),
  },
  {
    id: 'xss-3',
    labId: 'xss',
    description: 'Identify the OWASP Top 10 category for this vulnerability',
    hint: 'XSS falls under A03:2021 — Injection in the OWASP Top 10.',
    verify: (output) => output.includes('A03') || output.includes('Injection'),
  },
];

export const sqliTasks: Task[] = [
  {
    id: 'sqli-1',
    labId: 'sqli',
    description: 'Bypass the login with a UNION-based injection payload',
    hint: 'Try a payload like "admin\' UNION SELECT 1,2,3--" to extract data from the users table.',
    verify: (output) => output.includes('admin') && output.includes('BYPASS_SUCCESS'),
  },
  {
    id: 'sqli-2',
    labId: 'sqli',
    description: 'Rewrite the query using parameterized statements',
    hint: 'Switch to parameterized mode and verify the same injection payload no longer works.',
    verify: (output) => output.includes('PARAMETERIZED_SAFE'),
  },
  {
    id: 'sqli-3',
    labId: 'sqli',
    description: 'Identify the CWE ID for SQL injection',
    hint: 'SQL injection is classified under CWE-89: Improper Neutralization of Special Elements used in an SQL Command.',
    verify: (output) => output.includes('CWE-89'),
  },
];

export const headerTasks: Task[] = [
  {
    id: 'headers-1',
    labId: 'headers',
    description: 'Fetch real headers from https://example.com and identify missing security headers',
    hint: 'Look for Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, and X-Content-Type-Options.',
    verify: (output) => output.includes('Content-Security-Policy') || output.includes('Strict-Transport-Security') || output.includes('X-Frame-Options'),
  },
  {
    id: 'headers-2',
    labId: 'headers',
    description: 'Provide the correct CSP directive to block inline scripts',
    hint: 'A strict CSP uses "script-src \'self\'" to block inline JavaScript execution.',
    verify: (output) => output.includes('script-src') || output.includes('Content-Security-Policy'),
  },
  {
    id: 'headers-3',
    labId: 'headers',
    description: 'Identify HSTS as the header that enforces HTTPS',
    hint: 'Strict-Transport-Security tells browsers to only connect via HTTPS.',
    verify: (output) => output.includes('Strict-Transport-Security') || output.includes('HSTS'),
  },
];

export const allTasks: Task[] = [
  ...subnetTasks,
  ...httpTasks,
  ...networkTasks,
  ...dnsTasks,
  ...malwareTasks,
  ...attackVectorTasks,
  ...socialEngineeringTasks,
  ...xssTasks,
  ...sqliTasks,
  ...headerTasks,
];

export function getTasksForLab(labId: string): Task[] {
  return allTasks.filter((t) => t.labId === labId);
}
