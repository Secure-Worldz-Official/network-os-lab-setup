export interface LabStep {
  id: string;
  objective: string;
  command: string;
  match: string[];
}

export interface FoundationLab {
  id: string;
  title: string;
  topic: string;
  steps: LabStep[];
}

export const foundationLabs: FoundationLab[] = [
  {
    id: 'subnet-calculation',
    title: 'Subnet Calculation & Verification',
    topic: 'Subnetting',
    steps: [
      {
        id: 'sc-1',
        objective: 'Run ipcalc on 192.168.1.0/24 to display network details.',
        command: 'ipcalc 192.168.1.0/24',
        match: ['Network:', 'Broadcast:', 'Hostmask:', 'Hosts/Net:']
      },
      {
        id: 'sc-2',
        objective: 'Add IP address 192.168.1.65/26 to eth0 interface.',
        command: 'ip addr add 192.168.1.65/26 dev eth0',
        match: ['192.168.1.65/26']
      },
      {
        id: 'sc-3',
        objective: 'Display eth0 interface configuration to verify the new address.',
        command: 'ip addr show eth0',
        match: ['192.168.1.65/26', 'state UP']
      },
      {
        id: 'sc-4',
        objective: 'Recalculate the assigned /26 network and verify its host range.',
        command: 'ipcalc 192.168.1.64/26',
        match: ['Network:', 'Broadcast:', 'Hosts/Net:']
      }
    ]
  },
  {
    id: 'routing-table',
    title: 'Routing Table Inspection & Fix',
    topic: 'Networking',
    steps: [
      {
        id: 'rt-1',
        objective: 'Display the kernel routing table.',
        command: 'ip route',
        match: ['default', '10.10.10.0/24']
      },
      {
        id: 'rt-2',
        objective: 'Trace the route to 10.10.20.15.',
        command: 'traceroute 10.10.20.15',
        match: ['10.10.20.15', 'hop']
      },
      {
        id: 'rt-3',
        objective: 'Add a static route for 10.10.20.0/24 via 10.10.10.1.',
        command: 'ip route add 10.10.20.0/24 via 10.10.10.1',
        match: ['10.10.20.0/24', 'via 10.10.10.1']
      },
      {
        id: 'rt-4',
        objective: 'Ping 10.10.20.15 to verify the new route is working.',
        command: 'ping 10.10.20.15',
        match: ['64 bytes from 10.10.20.15']
      }
    ]
  },
  {
    id: 'manual-dns',
    title: 'Manual DNS Resolution',
    topic: 'Networking',
    steps: [
      {
        id: 'mdns-1',
        objective: 'Query the A record for training.local using dig.',
        command: 'dig training.local A',
        match: ['ANSWER SECTION', 'A']
      },
      {
        id: 'mdns-2',
        objective: 'Query the MX records for training.local.',
        command: 'dig training.local MX',
        match: ['ANSWER SECTION', 'MX']
      },
      {
        id: 'mdns-3',
        objective: 'Query the TXT records for training.local.',
        command: 'dig training.local TXT',
        match: ['ANSWER SECTION', 'TXT']
      },
      {
        id: 'mdns-4',
        objective: 'Resolve training.local using nslookup.',
        command: 'nslookup training.local',
        match: ['Name:', 'Address:']
      },
      {
        id: 'mdns-5',
        objective: 'Display the resolver configuration from /etc/resolv.conf.',
        command: 'cat /etc/resolv.conf',
        match: ['nameserver', 'search', 'domain']
      }
    ]
  },
  {
    id: 'port-discovery',
    title: 'Port & Service Discovery',
    topic: 'Networking',
    steps: [
      {
        id: 'pd-1',
        objective: 'List all listening TCP and UDP ports with process names.',
        command: 'netstat -tulpn',
        match: ['Proto', 'Local Address', 'Foreign Address', 'State', 'PID/Program name']
      },
      {
        id: 'pd-2',
        objective: 'Run a service version scan against 10.10.20.15.',
        command: 'nmap -sV 10.10.20.15',
        match: ['PORT', 'STATE', 'SERVICE', 'VERSION']
      },
      {
        id: 'pd-3',
        objective: 'Scan only ports 22, 80, and 443 on 10.10.20.15.',
        command: 'nmap -p 22,80,443 10.10.20.15',
        match: ['22/tcp', '80/tcp', '443/tcp']
      }
    ]
  },
  {
    id: 'tcp-handshake',
    title: 'TCP Handshake Capture',
    topic: 'Packet Analysis',
    steps: [
      {
        id: 'ths-1',
        objective: 'Start capturing packets on eth0 with tcpdump.',
        command: 'tcpdump -i eth0',
        match: ['tcpdump: listening', 'eth0', 'packets captured']
      },
      {
        id: 'ths-2',
        objective: 'Generate HTTP traffic by curling the target web server.',
        command: 'curl http://10.10.20.15',
        match: ['HTTP', '<', '>']
      },
      {
        id: 'ths-3',
        objective: 'Analyze captured packets with tshark on eth0.',
        command: 'tshark -i eth0',
        match: ['Capturing on', 'eth0', 'Frame']
      }
    ]
  },
  {
    id: 'firewall-config',
    title: 'Firewall Rule Configuration',
    topic: 'Firewalls',
    steps: [
      {
        id: 'fc-1',
        objective: 'List current iptables rules in numeric format.',
        command: 'iptables -L -n',
        match: ['Chain', 'target', 'prot', 'opt', 'source', 'destination']
      },
      {
        id: 'fc-2',
        objective: 'Add a DROP rule for inbound TCP port 80.',
        command: 'iptables -A INPUT -p tcp --dport 80 -j DROP',
        match: []
      },
      {
        id: 'fc-3',
        objective: 'Verify port 80 is blocked using nmap.',
        command: 'nmap -p 80 10.10.20.15',
        match: ['80/tcp', 'filtered']
      },
      {
        id: 'fc-4',
        objective: 'Add an ACCEPT rule for inbound TCP port 80.',
        command: 'iptables -A INPUT -p tcp --dport 80 -j ACCEPT',
        match: []
      },
      {
        id: 'fc-5',
        objective: 'Verify port 80 is now open using nmap.',
        command: 'nmap -p 80 10.10.20.15',
        match: ['80/tcp', 'open']
      },
      {
        id: 'fc-6',
        objective: 'List iptables rules again to confirm both rules are present.',
        command: 'iptables -L -n',
        match: ['ACCEPT', 'DROP', '80']
      }
    ]
  },
  {
    id: 'packet-filtering',
    title: 'Packet Filtering by Protocol',
    topic: 'Packet Analysis',
    steps: [
      {
        id: 'pf-1',
        objective: 'Start capturing all traffic on eth0.',
        command: 'tcpdump -i eth0',
        match: ['tcpdump: listening', 'eth0']
      },
      {
        id: 'pf-2',
        objective: 'Generate DNS traffic by resolving training.local.',
        command: 'dig training.local',
        match: ['ANSWER SECTION']
      },
      {
        id: 'pf-3',
        objective: 'Generate HTTP traffic by curling the web server.',
        command: 'curl http://10.10.20.15',
        match: ['HTTP']
      },
      {
        id: 'pf-4',
        objective: 'Generate ICMP traffic by pinging the target.',
        command: 'ping 10.10.20.15',
        match: ['64 bytes from 10.10.20.15']
      },
      {
        id: 'pf-5',
        objective: 'Filter captured packets for DNS queries using tshark.',
        command: 'tshark -i eth0 -Y dns',
        match: ['dns', 'Standard query']
      },
      {
        id: 'pf-6',
        objective: 'Filter captured packets for HTTP traffic using tshark.',
        command: 'tshark -i eth0 -Y http',
        match: ['http', 'GET', 'HTTP/']
      }
    ]
  },
  {
    id: 'nat-isolated',
    title: 'NAT vs Host-Only Network Configuration',
    topic: 'NAT & Isolated Networks',
    steps: [
      {
        id: 'nat-1',
        objective: 'Display all network interface addresses.',
        command: 'ip addr',
        match: ['eth0', 'inet', 'eth1']
      },
      {
        id: 'nat-2',
        objective: 'Ping 8.8.8.8 to verify internet connectivity via NAT.',
        command: 'ping 8.8.8.8',
        match: ['64 bytes from 8.8.8.8']
      },
      {
        id: 'nat-3',
        objective: 'Display the routing table.',
        command: 'ip route',
        match: ['default', '10.10.10.0/24']
      },
      {
        id: 'nat-4',
        objective: 'Ping the isolated target VM at 192.168.56.102.',
        command: 'ping 192.168.56.102',
        match: ['64 bytes from 192.168.56.102']
      },
      {
        id: 'nat-5',
        objective: 'Scan services on the isolated target VM.',
        command: 'nmap -sV 192.168.56.102',
        match: ['Nmap scan', 'PORT', 'STATE', 'SERVICE']
      }
    ]
  },
  {
    id: 'user-permissions',
    title: 'User & Permission Management',
    topic: 'Operating Systems',
    steps: [
      {
        id: 'up-1',
        objective: 'Display the current effective username.',
        command: 'whoami',
        match: ['root', 'cyberpath_explorer', 'kali']
      },
      {
        id: 'up-2',
        objective: 'List all groups the current user belongs to.',
        command: 'groups',
        match: ['root', 'sudo', 'adm', 'docker']
      },
      {
        id: 'up-3',
        objective: 'Create a new user named labuser.',
        command: 'useradd labuser',
        match: []
      },
      {
        id: 'up-4',
        objective: 'Set permissions on notes.txt to 640.',
        command: 'chmod 640 notes.txt',
        match: []
      },
      {
        id: 'up-5',
        objective: 'Find all files with the SUID bit set.',
        command: 'find / -perm -4000',
        match: ['find:', 'perm']
      }
    ]
  },
  {
    id: 'process-service',
    title: 'Process & Service Control',
    topic: 'Operating Systems',
    steps: [
      {
        id: 'ps-1',
        objective: 'List all running processes with detailed information.',
        command: 'ps aux',
        match: ['USER', 'PID', '%CPU', '%MEM', 'COMMAND']
      },
      {
        id: 'ps-2',
        objective: 'Launch the top process viewer.',
        command: 'top',
        match: ['top -', 'Tasks:', '%Cpu(s)']
      },
      {
        id: 'ps-3',
        objective: 'Check the status of the SSH service.',
        command: 'systemctl status ssh',
        match: ['ssh.service', 'active', 'loaded']
      },
      {
        id: 'ps-4',
        objective: 'Disable the telnet service from starting at boot.',
        command: 'systemctl disable telnet',
        match: ['telnet.service', 'disabled']
      },
      {
        id: 'ps-5',
        objective: 'Terminate process with PID 4242.',
        command: 'kill 4242',
        match: []
      },
      {
        id: 'ps-6',
        objective: 'List all systemd unit files and their enable status.',
        command: 'systemctl list-unit-files',
        match: ['UNIT FILE', 'STATE']
      }
    ]
  },
  {
    id: 'log-analysis',
    title: 'Log File Analysis',
    topic: 'Operating Systems',
    steps: [
      {
        id: 'la-1',
        objective: 'List the contents of /var/log directory.',
        command: 'ls /var/log',
        match: ['auth.log', 'syslog', 'kern.log']
      },
      {
        id: 'la-2',
        objective: 'Display the full contents of /var/log/auth.log.',
        command: 'cat /var/log/auth.log',
        match: ['auth.log', 'sshd', 'sudo']
      },
      {
        id: 'la-3',
        objective: 'Search auth.log for all Failed password entries.',
        command: 'grep "Failed password" /var/log/auth.log',
        match: ['Failed password']
      },
      {
        id: 'la-4',
        objective: 'Search auth.log for entries from IP 203.0.113.77.',
        command: 'grep "203.0.113.77" /var/log/auth.log',
        match: ['203.0.113.77']
      },
      {
        id: 'la-5',
        objective: 'Display the last 20 lines of auth.log in real time.',
        command: 'tail /var/log/auth.log',
        match: ['auth.log']
      }
    ]
  },
  {
    id: 'system-hardening',
    title: 'Basic System Hardening',
    topic: 'Operating Systems',
    steps: [
      {
        id: 'sh-1',
        objective: 'Check the current PermitRootLogin setting in sshd_config.',
        command: 'grep "PermitRootLogin" /etc/ssh/sshd_config',
        match: ['PermitRootLogin', 'yes']
      },
      {
        id: 'sh-2',
        objective: 'Disable root SSH login by changing PermitRootLogin to no.',
        command: 'sed -i "s/PermitRootLogin yes/PermitRootLogin no/" /etc/ssh/sshd_config',
        match: []
      },
      {
        id: 'sh-3',
        objective: 'Change the SSH port from 22 to 2222.',
        command: 'sed -i "s/#Port 22/Port 2222/" /etc/ssh/sshd_config',
        match: []
      },
      {
        id: 'sh-4',
        objective: 'Restart the SSH service to apply configuration changes.',
        command: 'systemctl restart ssh',
        match: ['ssh.service', 'restart']
      },
      {
        id: 'sh-5',
        objective: 'Verify PermitRootLogin is now set to no.',
        command: 'grep "PermitRootLogin no" /etc/ssh/sshd_config',
        match: ['PermitRootLogin no']
      },
      {
        id: 'sh-6',
        objective: 'Verify the SSH port is now set to 2222.',
        command: 'grep "Port 2222" /etc/ssh/sshd_config',
        match: ['Port 2222']
      }
    ]
  },
  {
    id: 'resource-monitoring',
    title: 'Resource Monitoring & Diagnosis',
    topic: 'Operating Systems',
    steps: [
      {
        id: 'rm-1',
        objective: 'Display disk space usage in human-readable format.',
        command: 'df -h',
        match: ['Filesystem', 'Size', 'Used', 'Avail', 'Use%', 'Mounted on']
      },
      {
        id: 'rm-2',
        objective: 'Calculate the total size of /var/log directory.',
        command: 'du -sh /var/log',
        match: ['/var/log']
      },
      {
        id: 'rm-3',
        objective: 'Display memory usage in human-readable format.',
        command: 'free -h',
        match: ['total', 'used', 'free', 'shared', 'buff/cache', 'available']
      },
      {
        id: 'rm-4',
        objective: 'Launch the top process viewer to inspect resource usage.',
        command: 'top',
        match: ['top -', 'Tasks:', '%Cpu(s)', 'MiB Mem']
      },
      {
        id: 'rm-5',
        objective: 'Remove the lab archive log from /tmp.',
        command: 'rm /tmp/lab-archive.log',
        match: []
      },
      {
        id: 'rm-6',
        objective: 'Re-check disk space to confirm space was freed.',
        command: 'df -h',
        match: ['Filesystem', 'Size', 'Used', 'Avail']
      }
    ]
  },
  { id: 'static-ip', title: 'Static IP Configuration & Verification', topic: 'Networking', steps: [
    { id: 'sip-1', objective: 'Inspect the active interface address.', command: 'ip addr show eth0', match: ['inet'] }, { id: 'sip-2', objective: 'Add the assigned static address.', command: 'ip addr add 192.168.1.65/26 dev eth0', match: ['added'] }, { id: 'sip-3', objective: 'Verify the configured address.', command: 'ip addr show eth0', match: ['inet'] }, { id: 'sip-4', objective: 'Validate the gateway path.', command: 'ping 192.168.1.1', match: ['64 bytes'] }, { id: 'sip-5', objective: 'Verify target services after configuration.', command: 'nmap -sV 10.10.20.15', match: ['PORT'] }
  ] },
  { id: 'network-troubleshooting', title: 'Network Troubleshooting Simulation', topic: 'Networking', steps: [
    { id: 'nts-1', objective: 'Inspect interface addressing.', command: 'ip addr', match: ['eth0'] }, { id: 'nts-2', objective: 'Inspect the routing table.', command: 'ip route', match: ['default'] }, { id: 'nts-3', objective: 'Test default-gateway reachability.', command: 'ping 10.10.10.1', match: ['64 bytes'] }, { id: 'nts-4', objective: 'Query the service DNS record.', command: 'dig training.local', match: ['ANSWER'] }, { id: 'nts-5', objective: 'Verify application reachability.', command: 'curl http://10.10.20.15', match: ['CyberPath'] }
  ] },
  { id: 'filesystem-navigation', title: 'Linux Filesystem Navigation & File Management', topic: 'Operating Systems', steps: [
    { id: 'fs-1', objective: 'Confirm the starting directory.', command: 'pwd', match: ['/home'] }, { id: 'fs-2', objective: 'List all workspace files.', command: 'ls -la', match: ['notes.txt'] }, { id: 'fs-3', objective: 'Create a working copy.', command: 'cp notes.txt notes-copy.txt', match: ['completed'] }, { id: 'fs-4', objective: 'Rename the working copy.', command: 'mv notes-copy.txt evidence.txt', match: ['completed'] }, { id: 'fs-5', objective: 'Remove the temporary file.', command: 'rm evidence.txt', match: ['completed'] }
  ] },
  { id: 'user-group-management', title: 'User & Group Management', topic: 'Operating Systems', steps: [
    { id: 'ug-1', objective: 'Create the audit user.', command: 'useradd audituser', match: ['completed'] }, { id: 'ug-2', objective: 'Assign the audit group.', command: 'usermod -aG sudo audituser', match: ['completed'] }, { id: 'ug-3', objective: 'Inspect current group membership.', command: 'groups', match: ['sudo'] }, { id: 'ug-4', objective: 'Inspect sudo authorization.', command: 'sudo -l', match: ['Matching'] }, { id: 'ug-5', objective: 'Verify the account record.', command: 'grep audituser /etc/passwd', match: ['audituser'] }
  ] },
  { id: 'service-management', title: 'Service Management with systemd', topic: 'Operating Systems', steps: [
    { id: 'svc-1', objective: 'Inspect SSH service state.', command: 'systemctl status ssh', match: ['ssh.service'] }, { id: 'svc-2', objective: 'Disable the unnecessary Telnet service.', command: 'systemctl disable telnet', match: ['completed'] }, { id: 'svc-3', objective: 'Stop the unnecessary service.', command: 'systemctl stop telnet', match: ['completed'] }, { id: 'svc-4', objective: 'Enable SSH at startup.', command: 'systemctl enable ssh', match: ['completed'] }, { id: 'svc-5', objective: 'Audit enabled unit files.', command: 'systemctl list-unit-files', match: ['ssh.service'] }
  ] },
  { id: 'package-management', title: 'Package Management Operations', topic: 'Operating Systems', steps: [
    { id: 'pkg-1', objective: 'Refresh package metadata.', command: 'apt update', match: ['completed'] }, { id: 'pkg-2', objective: 'Install the diagnostic package.', command: 'apt install dnsutils', match: ['completed'] }, { id: 'pkg-3', objective: 'Inspect the installed package.', command: 'apt show dnsutils', match: ['completed'] }, { id: 'pkg-4', objective: 'Remove the diagnostic package.', command: 'apt remove dnsutils', match: ['completed'] }, { id: 'pkg-5', objective: 'Verify package database consistency.', command: 'apt check', match: ['completed'] }
  ] },
  { id: 'shell-automation', title: 'Shell Scripting for Automation', topic: 'Operating Systems', steps: [
    { id: 'sh-1', objective: 'Create the automation script.', command: 'touch audit.sh', match: ['completed'] }, { id: 'sh-2', objective: 'Set executable permissions.', command: 'chmod 750 audit.sh', match: ['completed'] }, { id: 'sh-3', objective: 'Inspect the script workspace.', command: 'ls -la', match: ['audit.sh'] }, { id: 'sh-4', objective: 'Execute the audit script.', command: 'bash audit.sh', match: ['completed'] }, { id: 'sh-5', objective: 'Verify script output.', command: 'cat audit.log', match: ['AUDIT'] }
  ] }
];

export const topicOrder = [
  'Networking',
  'Operating Systems',
  'Packet Analysis',
  'Subnetting',
  'Firewalls',
  'NAT & Isolated Networks'
];
