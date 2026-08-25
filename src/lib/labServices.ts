// CyberPath Interactive Virtual Lab Infrastructure & Abstraction Layer

export interface TargetMachine {
  id: string;
  name: string;
  ip: string;
  os: 'Linux' | 'Windows' | 'FreeBSD';
  status: 'OFFLINE' | 'INITIALIZING' | 'RUNNING' | 'STOPPED';
  openPorts: number[];
  services: Record<number, string>;
  webApplicationUrl?: string;
  flags: Record<string, string>;
}

export interface LabSession {
  id: string;
  roomId: string;
  taskId: string;
  status: 'OFFLINE' | 'INITIALIZING' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';
  targetMachine: TargetMachine;
  timeRemainingSeconds: number; // e.g. 3600 (60 mins)
  initializationSteps: { label: string; done: boolean }[];
  vpnConnected: boolean;
  vpnNetworkName: string;
}

export interface TaskValidationResult {
  success: boolean;
  message: string;
  xpAwarded?: number;
}

// ─── DEFAULT MOCK TARGET MACHINES FOR ROOMS ───
export const MOCK_TARGET_MACHINES: Record<string, TargetMachine> = {
  'nmap-fundamentals': {
    id: 'target-nmap',
    name: 'RECON-BOX-01',
    ip: '10.10.20.15',
    os: 'Linux',
    status: 'OFFLINE',
    openPorts: [22, 80, 443, 3306],
    services: {
      22: 'OpenSSH 8.9p1 Ubuntu',
      80: 'nginx/1.18.0 (Ubuntu)',
      443: 'nginx/1.18.0 TLSv1.3',
      3306: 'MySQL 8.0.32-0ubuntu0.22.04.2'
    },
    webApplicationUrl: 'http://10.10.20.15',
    flags: {
      user: 'CP{NMAP_PORTS_ENUMERATED_2026}',
      web: 'FLAG{NMAP_WEB_RECON_SUCCESS}',
      root: 'CP{ROOT_PORT_MASTER}'
    }
  },
  'linux-fundamentals': {
    id: 'target-linux',
    name: 'LINUX-SHELL-01',
    ip: '10.10.10.5',
    os: 'Linux',
    status: 'OFFLINE',
    openPorts: [22],
    services: {
      22: 'OpenSSH 8.4p1'
    },
    flags: {
      flagTxt: 'FLAG{CYBERPATH_LINUX_CHAMP}',
      credsTxt: 'cyberpath123'
    }
  },
  'web-fundamentals': {
    id: 'target-web',
    name: 'WEB-TARGET-01',
    ip: '10.10.30.8',
    os: 'Linux',
    status: 'OFFLINE',
    openPorts: [80, 8080],
    services: {
      80: 'Apache/2.4.52 (Unix)',
      8080: 'Node.js Express Sandbox'
    },
    webApplicationUrl: 'http://10.10.30.8',
    flags: {
      httpFlag: 'CP{HTTP_HEADER_ANALYSIS_PRO}'
    }
  },
  'sqli-tester': {
    id: 'target-sqli',
    name: 'SQL-SANDBOX-01',
    ip: '10.10.40.12',
    os: 'Linux',
    status: 'OFFLINE',
    openPorts: [80, 3306],
    services: {
      80: 'Apache PHP 8.1',
      3306: 'MariaDB 10.6'
    },
    webApplicationUrl: 'http://10.10.40.12/login',
    flags: {
      adminBypass: 'CP{SQLI_UNION_BYPASS_COMPLETE}'
    }
  },
  'xss-playground': {
    id: 'target-xss',
    name: 'XSS-CONTAINER-01',
    ip: '10.10.50.22',
    os: 'Linux',
    status: 'OFFLINE',
    openPorts: [80],
    services: {
      80: 'React Client Container'
    },
    webApplicationUrl: 'http://10.10.50.22',
    flags: {
      xssFlag: 'CP{DOM_XSS_PAYLOAD_SUCCESS}'
    }
  },
  'default': {
    id: 'target-default',
    name: 'LAB-TARGET-01',
    ip: '10.10.20.10',
    os: 'Linux',
    status: 'OFFLINE',
    openPorts: [22, 80],
    services: {
      22: 'OpenSSH 8.2',
      80: 'Apache/2.4'
    },
    flags: {
      defaultFlag: 'CP{LAB_TARGET_SOLVED}'
    }
  }
};

// ─── VPN & CONNECTIVITY SYSTEM ───
export class VPNProvider {
  private static isConnected: boolean = true; // Default simulated connection for seamless user experience
  private static vpnNetwork: string = 'CYBERPATH-LAB-VPN';
  private static userIp: string = '10.8.0.14';

  static getStatus() {
    return {
      connected: this.isConnected,
      network: this.vpnNetwork,
      ip: this.userIp
    };
  }

  static toggleConnection(): boolean {
    this.isConnected = !this.isConnected;
    return this.isConnected;
  }

  static setConnection(connected: boolean) {
    this.isConnected = connected;
  }

  static generateConfigFile(username: string = 'cyber_explorer'): string {
    return `client
dev tun
proto udp
remote vpn.cyberpath.labs 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA512
# CYBERPATH PRIVATE LAB CREDENTIALS
# USER: ${username}
# GENERATED: ${new Date().toISOString()}
<ca>
-----BEGIN CERTIFICATE-----
MIIB/zCCAWagAwIBAgIUCPPATHLAB000000000000000001MA0GCSqGSIb3DQEBCwUA
MB4xHDAaBgNVBAMTE0NZQkVSUEFUSC1MQUItQ0EtMDEwDQYJKoZIhvcNAQELBQAD
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
MIIB/zCCAWagAwIBAgIUCPPATHUSER0000000000000001MA0GCSqGSIb3DQEBCwUA
-----END CERTIFICATE-----
</cert>
`;
  }
}

// ─── TASK & FLAG VALIDATION SERVICE ───
export class TaskValidator {
  static validate(userAnswer: string, expectedAnswer: string): TaskValidationResult {
    if (!userAnswer || !userAnswer.trim()) {
      return { success: false, message: 'Please enter an answer or flag.' };
    }

    const cleanedUser = userAnswer.trim().toLowerCase();
    const cleanedExpected = expectedAnswer.trim().toLowerCase();

    // Check exact match
    if (cleanedUser === cleanedExpected) {
      return {
        success: true,
        message: '✓ CORRECT ANSWER! Task completed.',
        xpAwarded: 50
      };
    }

    // Support comma-separated port lists or multi-part answers (e.g. "22, 80, 443" vs "22,80,443")
    const normalizeCommaList = (str: string) => str.split(',').map(s => s.trim()).sort().join(',');
    if (normalizeCommaList(cleanedUser) === normalizeCommaList(cleanedExpected)) {
      return {
        success: true,
        message: '✓ CORRECT ANSWER! Ports identified correctly.',
        xpAwarded: 50
      };
    }

    return {
      success: false,
      message: '✕ INCORRECT. Review the task objective and try again.'
    };
  }
}

// ─── SIMULATED TERMINAL ENGINE ───
export class TerminalProvider {
  private static currentDirectory: string = '/home/cyberpath';

  static executeCommand(commandStr: string, targetIp: string = '10.10.20.15'): { output: string; error?: boolean } {
    const trimmed = commandStr.trim();
    if (!trimmed) return { output: '' };

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
      case 'clear':
        return { output: '__CLEAR__' };

      case 'help':
        return {
          output: `CyberPath Educational CLI v2.4
Available commands:
  pwd               - Print working directory
  ls [-la]          - List directory contents
  cd <dir>          - Change directory
  cat <file>        - Print file content
  whoami            - Display active shell user
  ip [addr]         - Show network interfaces
  ping <ip>         - Ping remote target host
  curl <url>        - Fetch HTTP response body
  nmap <target>     - Execute network port scan
  clear             - Clear terminal screen`
        };

      case 'pwd':
        return { output: this.currentDirectory };

      case 'whoami':
        return { output: 'cyberpath_explorer' };

      case 'ls':
        if (this.currentDirectory === '/home/cyberpath') {
          return { output: 'flag.txt   credentials.txt   notes.txt   scans/' };
        } else if (this.currentDirectory === '/home/cyberpath/scans') {
          return { output: 'nmap_10.10.20.15.txt   target_recon.log' };
        }
        return { output: 'flag.txt' };

      case 'cd':
        const targetDir = args[0] || '~';
        if (targetDir === '..' || targetDir === '../') {
          this.currentDirectory = '/home/cyberpath';
        } else if (targetDir === 'scans' || targetDir === '/home/cyberpath/scans') {
          this.currentDirectory = '/home/cyberpath/scans';
        } else if (targetDir === '~' || targetDir === '/home/cyberpath') {
          this.currentDirectory = '/home/cyberpath';
        } else {
          return { output: `bash: cd: ${targetDir}: No such file or directory`, error: true };
        }
        return { output: '' };

      case 'cat':
        const file = args[0];
        if (!file) return { output: 'cat: missing file operand', error: true };

        if (file === 'flag.txt' || file === './flag.txt') {
          return { output: 'FLAG{CYBERPATH_LINUX_CHAMP}' };
        } else if (file === 'credentials.txt' || file === 'scans/credentials.txt') {
          return { output: 'target_admin:cyberpath123' };
        } else if (file === 'notes.txt') {
          return { output: 'Target machine is at 10.10.20.15. Open SSH port 22 and Web port 80.' };
        } else if (file === 'nmap_10.10.20.15.txt') {
          return { output: 'Nmap scan report for 10.10.20.15\nPORT 22/tcp open ssh\nPORT 80/tcp open http\nPORT 443/tcp open https\nPORT 3306/tcp open mysql' };
        }
        return { output: `cat: ${file}: No such file or directory`, error: true };

      case 'ip':
      case 'ifconfig':
        return {
          output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 10.10.10.5/24 brd 10.10.10.255 scope global eth0
3: tun0 (CYBERPATH-VPN):
    inet 10.8.0.14/24 scope global tun0`
        };

      case 'ping':
        const pingHost = args[0] || targetIp;
        return {
          output: `PING ${pingHost} (${pingHost}) 56(84) bytes of data.
64 bytes from ${pingHost}: icmp_seq=1 ttl=64 time=12.4 ms
64 bytes from ${pingHost}: icmp_seq=2 ttl=64 time=11.8 ms
64 bytes from ${pingHost}: icmp_seq=3 ttl=64 time=12.1 ms
--- ${pingHost} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2003ms`
        };

      case 'curl':
        const url = args[0] || targetIp;
        return {
          output: `<!DOCTYPE html>
<html>
<!-- Target URL: http://${url} -->
<head><title>CyberPath Simulated Web Target</title></head>
<body>
  <h1>Welcome to Web Box Target</h1>
  <p>Status: Active Security Laboratory</p>
  <!-- HIDDEN FLAG: FLAG{NMAP_WEB_RECON_SUCCESS} -->
</body>
</html>`
        };

      case 'nmap':
        const nmapTarget = args.find(a => !a.startsWith('-')) || targetIp;
        return {
          output: `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${nmapTarget}
Host is up (0.012s latency).
Not shown: 996 closed tcp ports (reset)

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu
80/tcp   open  http    nginx/1.18.0
443/tcp  open  https   nginx/1.18.0 TLSv1.3
3306/tcp open  mysql   MySQL 8.0.32

Nmap done: 1 IP address (1 host up) scanned in 2.14 seconds`
        };

      default:
        return { output: `bash: ${cmd}: command not found. Type 'help' for available commands.`, error: true };
    }
  }
}
