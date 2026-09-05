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
  private static isConnected: boolean = true;
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

    // Support comma-separated port lists
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

// ─── PROFESSIONAL DYNAMIC EXPERIMENT LAB TERMINAL ENGINE ───
export class TerminalProvider {
  private static currentDirectory: string = '/home/cyberpath';

  static getPromptForRoom(roomId?: string): string {
    switch (roomId) {
      case 'nmap-fundamentals':
        return 'root@nmap-kali:~#';
      case 'web-fundamentals':
        return 'analyst@web-kali:~#';
      case 'sqli-tester':
        return 'sqli@web-container:~$';
      case 'xss-playground':
        return 'analyst@xss-sandbox:~$';
      case 'hash-cracking':
        return 'cracker@hash-box:~#';
      case 'priv-esc':
        return 'www-data@target-system:~$';
      case 'soc-firewall':
        return 'analyst@soc-workstation:~$';
      default:
        return 'user@cyberpath:~$';
    }
  }

  static executeCommand(commandStr: string, targetIp: string = '10.10.20.15', roomId?: string): { output: string; error?: boolean } {
    const trimmed = commandStr.trim();
    if (!trimmed) return { output: '' };

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Universal CLI Commands
    switch (cmd) {
      case 'clear':
        return { output: '__CLEAR__' };

      case 'help':
        return {
          output: `CyberPath Professional CLI Terminal Environment (Room: ${roomId || 'General'})
Available CLI utilities:
  pwd               - Display working directory
  ls [-la]          - List files in active directory
  cd <dir>          - Navigate directories
  cat <file>        - Print file content
  whoami            - Display active shell account
  ip / ifconfig     - Display network interfaces
  ping <ip>         - ICMP echo ping probe
  curl <url>        - Query HTTP web targets
  nmap <target>     - Execute network port scanner
  gobuster / dirb   - Directory brute-force tools
  sqlmap            - Automated SQL injection auditing tool
  john / hashcat    - Cryptographic password cracking suites
  tcpdump / tshark  - Packet capture inspection tools
  find / sudo -l    - Privilege escalation enumeration
  clear             - Clear terminal display buffer`
        };

      case 'pwd':
        return { output: this.currentDirectory };

      case 'whoami':
        if (roomId === 'priv-esc') return { output: 'www-data (UID 1001)' };
        if (roomId === 'nmap-fundamentals' || roomId === 'hash-cracking') return { output: 'root (UID 0)' };
        return { output: 'cyberpath_explorer' };

      case 'ls':
        if (roomId === 'nmap-fundamentals') {
          return { output: 'nmap_quick_scan.txt   target_hosts.lst   recon_notes.md' };
        } else if (roomId === 'sqli-tester') {
          return { output: 'db_dump.sql   sqli_payloads.txt   admin_hash.txt' };
        } else if (roomId === 'hash-cracking') {
          return { output: 'hashes.txt   rockyou.txt   hashcat.hcstat' };
        } else if (roomId === 'priv-esc') {
          return { output: 'user.txt   suid_audit.sh   notes.txt' };
        } else if (roomId === 'soc-firewall') {
          return { output: 'firewall.log   capture.pcap   rules.conf' };
        }
        return { output: 'flag.txt   credentials.txt   notes.txt   scans/' };

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

        if (file === 'flag.txt' || file === './flag.txt' || file === 'user.txt') {
          if (roomId === 'priv-esc') return { output: 'CP{LINUX_PRIV_ESC_ROOT_MASTERED_2026}' };
          if (roomId === 'sqli-tester') return { output: 'CP{SQLI_UNION_BYPASS_COMPLETE}' };
          return { output: 'FLAG{CYBERPATH_LINUX_CHAMP}' };
        } else if (file === 'credentials.txt') {
          return { output: 'admin:cyberpath123\nuser:password123' };
        } else if (file === 'hashes.txt') {
          return { output: 'admin:$2b$12$e8./P7ZqW1Wk7gXQk...\nuser:ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f' };
        } else if (file === 'notes.txt') {
          return { output: `Target host IP: ${targetIp}\nPorts 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL) active.` };
        }
        return { output: `cat: ${file}: No such file or directory`, error: true };

      case 'ip':
      case 'ifconfig':
        if (args[0] === 'route') return { output: `default via 10.10.10.1 dev eth0\n10.10.10.0/24 dev eth0 proto kernel scope link src 10.10.10.5\n10.10.20.0/24 via 10.10.10.1 dev eth0` };
        if (args[0] === 'addr' && args[1] === 'add') return { output: 'RTNETLINK answers: address added to eth0' };
        return {
          output: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 10.10.10.5/24 brd 10.10.10.255 scope global eth0
3: tun0 (CYBERPATH-VPN):
    inet 10.8.0.14/24 scope global tun0`
        };

      case 'ipcalc': return { output: `Address:   ${args[0] || '192.168.1.0/24'}\nNetwork:   192.168.1.0/24\nBroadcast: 192.168.1.255\nHostmask:  0.0.0.255\nHosts/Net: 254` };
      case 'traceroute': return { output: `traceroute to ${args[0] || targetIp}\n 1  10.10.10.1  0.9 ms\n 2  ${args[0] || targetIp}  4.2 ms` };
      case 'dig':
      case 'nslookup': return { output: `;; ANSWER SECTION:\ntraining.local. 300 IN A ${targetIp}\ntraining.local. 300 IN MX 10 mail.training.local.\ntraining.local. 300 IN TXT "lab-verification"` };
      case 'netstat':
      case 'ss': return { output: `Proto Local Address           Foreign Address         State\ntcp   0.0.0.0:22              0.0.0.0:*               LISTEN\ntcp   10.10.10.5:49312        ${targetIp}:443         ESTABLISHED` };
      case 'iptables':
      case 'ufw': return { output: `Chain INPUT (policy ACCEPT)\nACCEPT tcp -- 0.0.0.0/0 0.0.0.0/0 tcp dpt:443\nDROP   tcp -- 0.0.0.0/0 0.0.0.0/0 tcp dpt:80` };
      case 'ps': return { output: `USER PID %CPU %MEM COMMAND\nroot 1 0.0 0.1 /sbin/init\nanalyst 4242 82.3 14.8 /usr/local/bin/lab-worker` };
      case 'top':
      case 'htop': return { output: `Tasks: 112 total, 1 running\nMem: 4194304 total, 313704 free\nPID 4242 analyst 82.3% lab-worker` };
      case 'systemctl': return { output: `ssh.service enabled\ntelnet.service disabled\nOperation completed.` };
      case 'groups': return { output: 'analyst : analyst adm sudo' };
      case 'chmod': case 'chown': case 'useradd': case 'usermod': case 'kill': case 'sed': case 'rm': case 'cp': case 'mv': case 'touch': case 'bash': return { output: `${cmd}: operation completed in isolated lab filesystem` };
      case 'apt':
      case 'yum':
      case 'dnf': return { output: `${cmd}: package operation completed successfully` };
      case 'df': return { output: `Filesystem Size Used Avail Use% Mounted on\n/dev/vda1 40G 34G 4.2G 89% /` };
      case 'du': return { output: '3.8G /var/log\n5.0G /var' };
      case 'free': return { output: 'Mem: 4194304 3780600 313704\nSwap: 2097148 218400 1878748' };
      case 'grep': return { output: 'Sep 05 14:20:11 kali sshd[1884]: Failed password for invalid user backup from 203.0.113.77 port 51214 ssh2' };
      case 'tail': return { output: 'Sep 05 14:20:18 kali sshd[1884]: Failed password for invalid user backup from 203.0.113.77 port 51219 ssh2' };

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
<head><title>CyberPath Target Container</title></head>
<body>
  <h1>Welcome to CyberPath Simulated Web Environment</h1>
  <p>Server: Apache/2.4.52 (Ubuntu)</p>
  <!-- SECRET HEADER FLAG: CP{HTTP_HEADER_ANALYSIS_PRO} -->
</body>
</html>`
        };

      case 'nmap':
        const nmapTarget = args.find(a => !a.startsWith('-')) || targetIp;
        return {
          output: `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toISOString().slice(0, 19).replace('T', ' ')}
Nmap scan report for ${nmapTarget}
Host is up (0.0094s latency).
Not shown: 996 closed tcp ports (reset)

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu
80/tcp   open  http    nginx/1.18.0
443/tcp  open  https   nginx/1.18.0 TLSv1.3
3306/tcp open  mysql   MySQL 8.0.32 (Ubuntu)

Nmap done: 1 IP address (1 host up) scanned in 1.84 seconds`
        };

      case 'sqlmap':
        return {
          output: `[+] Automated SQL Injection Audit Engine v1.7.2
[+] Testing connection to target ${targetIp}...
[+] GET parameter 'id' is vulnerable to SQL injection!
[+] Type: UNION query-based / Error-based
[+] Backend DBMS: MySQL >= 8.0
[+] Database: cyberpath_db
[+] Retrieved Flag: CP{SQLI_UNION_BYPASS_COMPLETE}`
        };

      case 'john':
      case 'hashcat':
        return {
          output: `[+] Cryptographic Hash Cracking Engine initialized.
[+] Loaded 1 hash digest (SHA-256)
[+] Using dictionary wordlist: /usr/share/wordlists/rockyou.txt
[+] Status: CRACKED!
[+] Hash: ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f -> 'password123'`
        };

      case 'sudo':
        if (args.includes('-l')) {
          return {
            output: `Matching Defaults entries for www-data on target-system:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin

User www-data may run the following commands on target-system:
    (root) NOPASSWD: /usr/bin/python3`
          };
        }
        return { output: 'sudo: a password is required', error: true };

      case 'find':
        if (args.includes('-perm') || args.includes('-4000')) {
          return {
            output: `/usr/bin/python3 [SUID BIT SET - ROOT OWNED]
/usr/bin/sudo
/usr/bin/passwd`
          };
        }
        return { output: './flag.txt\n./credentials.txt' };

      case 'tcpdump':
      case 'tshark':
        return {
          output: `14:22:01.104201 IP 10.8.0.14.48204 > ${targetIp}.80: Flags [P.], seq 1:120, ack 1, win 502, length 119
14:22:01.109842 IP ${targetIp}.80 > 10.8.0.14.48204: Flags [.], ack 120, win 501, length 0
14:22:01.110200 IP ${targetIp}.80 > 10.8.0.14.48204: Flags [P.], seq 1:340, ack 120, win 501, length 339 [HTTP GET /index.html 200 OK]`
        };

      case 'gobuster':
      case 'dirb':
        return {
          output: `===============================================================
Gobuster v3.5 - Directory & File Enumeration
Target: http://${targetIp}
===============================================================
/admin                (Status: 301) [Size: 178]
/login                (Status: 200) [Size: 2450]
/uploads              (Status: 403) [Size: 278]
/api                  (Status: 200) [Size: 840]`
        };

      default:
        return { output: `bash: ${cmd}: command not found. Type 'help' for available CLI commands.`, error: true };
    }
  }
}
