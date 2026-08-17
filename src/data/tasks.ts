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
    description: 'Calculate the network address for 192.168.1.0/24',
    hint: 'The network address is the first address in the subnet. Run the calculator and look for the "Network:" line.',
    verify: (output) => output.includes('Network:  192.168.1.0'),
  },
  {
    id: 'subnet-2',
    labId: 'subnet',
    description: 'Calculate the broadcast address for 192.168.1.0/24',
    hint: 'The broadcast address is the last address in the subnet. Look for the "Broadcast:" line.',
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
    hint: 'Look for the "Class:" line in the output. 192.x.x.x falls in a specific class range.',
    verify: (output) => output.includes('Class:    C'),
  },
  {
    id: 'subnet-5',
    labId: 'subnet',
    description: 'Confirm 192.168.1.0 is a private IP address',
    hint: 'Look for the "Type:" line. RFC 1918 defines private ranges.',
    verify: (output) => output.includes('Type:     Private (RFC 1918)'),
  },
];

export const httpTasks: Task[] = [
  {
    id: 'http-1',
    labId: 'http',
    description: 'Send a GET request and receive a 200 OK response',
    hint: 'Use the default URL and method, then click "Send Request". Look for the status line in the response.',
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
    hint: 'The timing badge shows the elapsed time in milliseconds.',
    verify: (_output: string, _error?: string, timing?: number | null) => timing !== undefined && timing !== null && timing < 10000,
  },
];

export const networkTasks: Task[] = [
  {
    id: 'network-1',
    labId: 'network',
    description: 'Run the network inspection successfully',
    hint: 'Click "Run Inspection" and wait for the scan to complete.',
    verify: (output, error) => !error && output.includes('=== Browser & Environment ==='),
  },
  {
    id: 'network-2',
    labId: 'network',
    description: 'Verify your browser platform is detected',
    hint: 'Look for the "Platform:" line in the Browser & Environment section.',
    verify: (output) => output.includes('Platform:') && !output.includes('Platform:         unknown'),
  },
  {
    id: 'network-3',
    labId: 'network',
    description: 'Confirm your online status is detected',
    hint: 'Look for the "Online:" line at the end of the output.',
    verify: (output) => output.includes('Online:') && (output.includes('Online:           yes') || output.includes('Online:           no')),
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

export const allTasks: Task[] = [
  ...subnetTasks,
  ...httpTasks,
  ...networkTasks,
  ...dnsTasks,
];

export function getTasksForLab(labId: string): Task[] {
  return allTasks.filter((t) => t.labId === labId);
}
