export interface Resource {
  title: string;
  url: string;
  description?: string;
}

export interface Day {
  id: number;
  slug: string;
  title: string;
  learn: string[];
  doLab: string[];
  example: {
    title: string;
    prose: string;
    code?: string;
  };
  resources: Resource[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  dayRange: string;
  days: Day[];
  comingSoon: boolean;
}

export const roadmap: Module[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Foundations',
    subtitle: 'Networking, OS & Lab Setup',
    description:
      'Build the bedrock knowledge every cybersecurity professional needs — from understanding the CIA Triad to capturing real network traffic in Wireshark. By the end of this module you will have a fully functional isolated lab environment and a clear mental model of how data moves across networks.',
    dayRange: 'Days 1–9',
    comingSoon: false,
    days: [
      {
        id: 1,
        slug: 'day-1',
        title: 'Welcome + Cyber Career Roadmap',
        learn: [
          'What cybersecurity actually means in plain language — and why "hacking" is only one tiny slice of the field.',
          'The CIA Triad: Confidentiality, Integrity, and Availability — the three pillars every security decision is measured against.',
          'Career paths in detail: SOC Analyst, Penetration Tester, Application Security (AppSec), and Governance, Risk & Compliance (GRC).',
          'How to read and use this roadmap effectively — what each day expects from you and how to pace yourself.',
        ],
        doLab: [
          'Walk through this entire roadmap page and read each module overview so you know exactly what is coming.',
          'Write down three personal learning goals. Be specific — not "learn hacking" but "understand how a SQL injection attack works by Day 25."',
          'Set up your progress tracker by marking Day 1 complete at the end of this session.',
          'Create a study schedule: decide which days of the week you will spend 1–2 hours on this material.',
        ],
        example: {
          title: 'CIA Triad — Online Banking in the Real World',
          prose: `The CIA Triad is not just theory — it maps directly onto systems you use every day. Consider your online banking app:

**Confidentiality** means that only you (and the bank) can see your account balance and transactions. This is enforced through HTTPS encryption (TLS 1.3) which scrambles your data in transit, and through authentication — the bank verifies your identity with a password and often a second factor (OTP, biometric) before showing you anything.

**Integrity** means that a transaction, once recorded, cannot be silently altered. If you transfer £200 to a friend, the record of that transfer must be immutable. Banks enforce this with cryptographic checksums, database write-ahead logs, and audit trails. If an attacker could modify a transaction mid-flight — say, changing the recipient account number — integrity would be violated. This is exactly what a man-in-the-middle attack attempts.

**Availability** means the banking app must be up and responsive when you need it. Banks invest heavily in redundant servers, DDoS protection, and failover systems so that a Denial-of-Service attack (or just a traffic spike on payday) doesn't take the service offline.

**Career paths at a glance:**
- **SOC Analyst**: You sit in a Security Operations Centre, monitoring dashboards and alerts 24/7. When an alert fires, you triage it — is this a real threat or a false positive? Day-in-life: reviewing SIEM logs, escalating incidents, writing incident reports.
- **Penetration Tester**: You are paid to try to break into systems — legally, with written permission. You find vulnerabilities before the bad guys do. Day-in-life: scoping engagements, running tools like Nmap/Burp Suite, writing professional reports.
- **AppSec Engineer**: You work alongside developers to bake security into software from the start (shift-left). Day-in-life: threat modeling new features, reviewing pull requests for security flaws, configuring SAST/DAST tools in CI pipelines.
- **GRC Analyst**: You translate legal and regulatory requirements (GDPR, ISO 27001, SOC 2) into internal policies and ensure the organisation follows them. Day-in-life: risk assessments, policy writing, audit preparation.`,
        },
        resources: [
          {
            title: 'NIST — Guide to the CIA Triad',
            url: 'https://www.nist.gov/cybersecurity',
            description: 'The National Institute of Standards and Technology — the gold standard for security frameworks and definitions.',
          },
          {
            title: 'CyberSeek — Cybersecurity Career Pathways',
            url: 'https://www.cyberseek.org/pathway.html',
            description: 'Interactive map of cybersecurity career roles, required skills, and salary data based on real job postings.',
          },
          {
            title: 'CompTIA — Cybersecurity Career Roadmap',
            url: 'https://www.comptia.org/content/it-careers-path-roadmap/cybersecurity-specialist',
            description: 'Industry-recognized certification body\'s overview of how roles interconnect and what skills each requires.',
          },
          {
            title: 'OWASP — What is Application Security?',
            url: 'https://owasp.org/www-project-web-security-testing-guide/',
            description: 'The Open Worldwide Application Security Project\'s comprehensive guide — the bible of AppSec.',
          },
        ],
      },
      {
        id: 2,
        slug: 'day-2',
        title: 'Lab Setup — Step by Step',
        learn: [
          'Why you must never practice offensive security techniques on systems you don\'t own or haven\'t explicitly been authorised to test.',
          'What a Virtual Machine (VM) is: a software-defined computer running inside your real computer, fully isolated from your main OS.',
          'Why VirtualBox + Kali Linux is the industry-standard beginner lab setup — free, battle-tested, and widely documented.',
          'Key VM settings that affect performance and stability: RAM, CPU cores, storage type (VDI vs VMDK), and network adapter mode.',
        ],
        doLab: [
          'Download and install VirtualBox from virtualbox.org — choose the installer for your host OS (Windows/macOS/Linux).',
          'Download the official Kali Linux VirtualBox image (the pre-built .ova file) from kali.org/get-kali — this saves hours vs. manual installation.',
          'Import the .ova into VirtualBox via File → Import Appliance.',
          'Boot the VM, log in with default credentials (kali / kali), and run `sudo apt update && sudo apt upgrade -y` to bring everything current.',
        ],
        example: {
          title: 'Recommended VirtualBox VM Settings for Kali Linux',
          prose: `When creating or adjusting a Kali Linux VM, these settings strike the right balance between performance and stability on a typical laptop with 8–16 GB RAM:

**Base Memory (RAM):** 4096 MB (4 GB). Kali's GNOME desktop needs at least 2 GB to run without constant swapping; 4 GB gives you room for tools like Burp Suite or Metasploit alongside the desktop.

**Processors:** 2 CPUs. Kali is multi-threaded; giving it 2 virtual CPUs makes tools like Nmap's parallel scanning noticeably faster.

**Storage:** 80 GB dynamically allocated VDI. "Dynamically allocated" means the file on your host only grows as you actually use space — an 80 GB virtual disk might only occupy 12 GB on your real drive initially.

**Network Adapter (for now):** NAT. This lets the VM access the internet through your host machine for updates, while keeping it invisible to your local network. In Day 8 you will switch to Host-only for isolated lab practice.

**Display:** Video Memory 128 MB, enable 3D acceleration — this makes the desktop rendering smooth and prevents screen tearing.

**After first boot — verify connectivity:**`,
          code: `# Inside the Kali VM terminal
ip addr show eth0        # Should show a 10.x.x.x NAT address
ping -c 4 8.8.8.8        # Confirms internet access through NAT
sudo apt update          # Fetches package lists — if this works, the lab is alive`,
        },
        resources: [
          {
            title: 'VirtualBox — Official Download & Documentation',
            url: 'https://www.virtualbox.org/wiki/Downloads',
            description: 'The official VirtualBox download page — always use this; avoid third-party mirrors.',
          },
          {
            title: 'Kali Linux — Get Kali (Official Downloads)',
            url: 'https://www.kali.org/get-kali/',
            description: 'Official Kali Linux downloads. Choose "Virtual Machines" → VirtualBox .ova for the fastest setup.',
          },
          {
            title: 'VirtualBox User Manual — Virtual Machine Settings',
            url: 'https://www.virtualbox.org/manual/ch03.html',
            description: 'Chapter 3 of the VirtualBox manual covers every VM setting in detail — the reference when you are unsure what a setting does.',
          },
        ],
      },
      {
        id: 3,
        slug: 'day-3',
        title: 'What is a Network? (IP Basics)',
        learn: [
          'What an IP address is: a unique numerical label (e.g. 192.168.1.42) assigned to every device on a network — think of it as a postal address for data.',
          'IPv4 vs IPv6: why IPv4 (32-bit, ~4.3 billion addresses) is running out and IPv6 (128-bit) is the long-term answer.',
          'Public vs Private IP addresses: private ranges (10.x.x.x, 172.16–31.x.x, 192.168.x.x) are used inside home/office networks; public IPs are globally routable.',
          'What a router does: translates between your private home network and the public internet using NAT (Network Address Translation).',
          'What a switch does: connects devices within the same local network and forwards data based on MAC addresses.',
        ],
        doLab: [
          'On Windows, open Command Prompt and run `ipconfig /all`. On Linux/macOS, run `ip addr` or `ifconfig`. Record your IPv4 address, subnet mask, and default gateway.',
          'Identify whether your IP is in a private range (it almost certainly will be).',
          'Ping your router/default gateway: `ping 192.168.1.1` (or whatever your gateway IP is). Observe the round-trip time.',
          'Draw a simple diagram of your home network: your device → switch/router → modem → ISP → internet. Label each IP if you can.',
        ],
        example: {
          title: 'Reading ipconfig / ifconfig Output and Understanding a Ping Reply',
          prose: `Here is real \`ipconfig\` output from a Windows machine, annotated:`,
          code: `C:\\> ipconfig /all

Ethernet adapter Local Area Connection:
   IPv4 Address. . . . . . : 192.168.1.105   ← Your private IP on this LAN
   Subnet Mask . . . . . . : 255.255.255.0   ← /24 — 256 addresses in this subnet
   Default Gateway . . . . : 192.168.1.1     ← Your router's LAN IP
   DNS Servers . . . . . . : 8.8.8.8         ← Google's DNS resolver

# The 192.168.1.x range is a private range (RFC 1918).
# Traffic to/from the internet uses your router's PUBLIC IP,
# which you can find at: https://ifconfig.me

# Now ping the router:
C:\\> ping 192.168.1.1

Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64

# bytes=32  → Size of the ICMP echo payload
# time=1ms  → Round-trip latency to your router (should be <5ms on LAN)
# TTL=64    → Time To Live: router starts at 64, decrements each hop.
#             If TTL reaches 0, the packet is dropped (prevents loops).`,
        },
        resources: [
          {
            title: 'RFC 1918 — Address Allocation for Private Internets',
            url: 'https://datatracker.ietf.org/doc/html/rfc1918',
            description: 'The original IETF specification defining the three private IPv4 address ranges used in virtually every home and office network.',
          },
          {
            title: 'Cloudflare Learning — What is an IP Address?',
            url: 'https://www.cloudflare.com/learning/dns/glossary/what-is-my-ip-address/',
            description: 'Clear, accurate explainer covering public/private IPs, NAT, and IPv4 vs IPv6.',
          },
          {
            title: 'MDN Web Docs — How the Internet Works',
            url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/How_does_the_Internet_work',
            description: 'Mozilla\'s primer on internet fundamentals — routers, IPs, packets, and the big picture.',
          },
        ],
      },
      {
        id: 4,
        slug: 'day-4',
        title: 'OSI & TCP/IP Model',
        learn: [
          'The 7-layer OSI model: Physical, Data Link, Network, Transport, Session, Presentation, Application — and what each layer is actually responsible for.',
          'The 4-layer TCP/IP model used in practice: Network Access, Internet, Transport, Application.',
          'How data is encapsulated as it travels down the stack (headers are added at each layer) and de-encapsulated on the receiving end.',
          'The postal-service analogy: Physical = the roads, Data Link = the local delivery truck, Network = the postal routing system, Transport = the envelope with return address, Application = the letter inside.',
          'The difference between TCP (reliable, ordered, connection-oriented) and UDP (fast, connectionless, no delivery guarantee).',
        ],
        doLab: [
          'Open Chrome or Firefox and press F12 to open DevTools. Click the "Network" tab.',
          'Navigate to https://example.com — watch the requests populate in the Network panel.',
          'Click on the first request and explore the Headers tab: Request Headers, Response Headers, and the status code.',
          'Try to identify: the Application layer data (HTTP headers), the Transport layer info (TCP — look at connection timing), and the Network layer (the remote IP visible in the General section).',
        ],
        example: {
          title: 'Tracing an HTTP Request Through the OSI Layers',
          prose: `When you type \`https://example.com\` and press Enter, here is what happens at each OSI layer:

**Layer 7 — Application:** Your browser constructs an HTTP GET request:
\`GET / HTTP/1.1\\nHost: example.com\\nUser-Agent: Chrome/...\`

**Layer 6 — Presentation:** TLS encryption is applied here. The HTTP request is encrypted using the agreed cipher suite (e.g. TLS_AES_128_GCM_SHA256). This is the "S" in HTTPS.

**Layer 5 — Session:** TLS also manages the session — the handshake that establishes shared encryption keys before data flows.

**Layer 4 — Transport:** TCP wraps the encrypted data. It assigns a source port (e.g. 54321, a random ephemeral port) and a destination port (443 for HTTPS). TCP ensures all segments arrive in order and requests retransmission if any are lost.

**Layer 3 — Network:** IP adds source IP (your machine, e.g. 192.168.1.105) and destination IP (93.184.216.34 — example.com's server). Routers operate here.

**Layer 2 — Data Link:** Ethernet or Wi-Fi frames are created, with MAC addresses for the next hop (your router). Switches operate here.

**Layer 1 — Physical:** The bits are converted to electrical signals (Ethernet), radio waves (Wi-Fi), or light pulses (fibre) and sent.

**In Chrome DevTools Network tab, you can see:**`,
          code: `General:
  Request URL: https://example.com/
  Request Method: GET
  Status Code: 200 OK
  Remote Address: 93.184.216.34:443    ← Layer 3 (IP) + Layer 4 (Port 443)
  Referrer Policy: strict-origin-when-cross-origin

Request Headers:
  :authority: example.com              ← Layer 7 (HTTP/2 header)
  :method: GET
  :scheme: https                       ← Layer 6 (TLS in use)
  accept: text/html
  user-agent: Mozilla/5.0...

Timing:
  DNS Lookup:      5ms                 ← Name resolution
  TCP Connection:  12ms                ← Layer 4 handshake
  TLS Setup:       28ms                ← Layer 6 handshake
  TTFB:            45ms                ← Time to first byte from server`,
        },
        resources: [
          {
            title: 'Cloudflare Learning — What is the OSI Model?',
            url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            description: 'One of the clearest, most accurate OSI explanations available — written by networking experts, not Wikipedia editors.',
          },
          {
            title: 'MDN Web Docs — An Overview of HTTP',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
            description: 'Deep dive into HTTP at the Application layer — the protocol you will encounter constantly in web security.',
          },
          {
            title: 'RFC 793 — TCP Specification',
            url: 'https://datatracker.ietf.org/doc/html/rfc793',
            description: 'The original TCP specification. Dense, but reading sections 1–3 gives you a genuine understanding of how TCP reliability works.',
          },
        ],
      },
      {
        id: 5,
        slug: 'day-5',
        title: 'Subnetting Basics',
        learn: [
          'What a subnet is: a logical subdivision of a larger IP network, allowing you to group devices and control traffic flow between groups.',
          'What a subnet mask means: 255.255.255.0 (/24) means the first 24 bits identify the network; the last 8 bits identify individual hosts.',
          'CIDR notation: /24 = 255.255.255.0, /25 = 255.255.255.128, /26 = 255.255.255.192, /16 = 255.255.0.0.',
          'Why networks are divided into subnets: to reduce broadcast traffic, improve security (segment sensitive systems), and better manage IP address space.',
          'Key formulas: number of hosts = 2^(32−prefix) − 2 (subtract 2 for network and broadcast addresses).',
        ],
        doLab: [
          'Open the subnet calculator at subnet-calculator.com. Enter 192.168.1.0 with a /24 mask. Read the network address, broadcast, and usable host range.',
          'Manually calculate the 4 subnets of 192.168.1.0/24 split into /26 blocks (follow the worked example below).',
          'Verify your answers using the calculator.',
          'Challenge: what is the subnet mask, network address, and broadcast for the host 10.0.0.200/22?',
        ],
        example: {
          title: 'Manual Subnetting: Splitting 192.168.1.0/24 into 4 Equal Subnets',
          prose: `We start with the network 192.168.1.0/24 which gives us 254 usable hosts. We need to split it into 4 equal subnets.

**Step 1: Determine the new prefix length.**
To create 4 subnets, we need 2 additional bits (2² = 4). So the new prefix is /24 + 2 = **/26**.

**Step 2: Calculate block size.**
A /26 subnet uses 26 bits for the network, leaving 6 bits for hosts. Block size = 2⁶ = 64 addresses per subnet.

**Step 3: List the 4 subnets.**

| Subnet | Network Address | Usable Range | Broadcast | Hosts |
|--------|----------------|--------------|-----------|-------|
| 1 | 192.168.1.0/26 | .1 – .62 | .63 | 62 |
| 2 | 192.168.1.64/26 | .65 – .126 | .127 | 62 |
| 3 | 192.168.1.128/26 | .129 – .190 | .191 | 62 |
| 4 | 192.168.1.192/26 | .193 – .254 | .255 | 62 |

**Key rule:** The first address in each block is the network address (cannot be assigned to a host). The last address is the broadcast address (sent to all hosts in the subnet). Every address in between is usable.

**Subnet mask for /26 in dotted decimal:**`,
          code: `# /26 = 11111111.11111111.11111111.11000000
#        255      .255      .255      .192

# Binary breakdown of 192 = 11000000:
# Bit values: 128 + 64 = 192 ✓

# Verify with Python:
>>> import ipaddress
>>> net = ipaddress.IPv4Network('192.168.1.0/24')
>>> subnets = list(net.subnets(prefixlen_diff=2))
>>> for s in subnets:
...     print(f"Network: {s.network_address}  Broadcast: {s.broadcast_address}  Hosts: {s.num_addresses - 2}")
Network: 192.168.1.0    Broadcast: 192.168.1.63   Hosts: 62
Network: 192.168.1.64   Broadcast: 192.168.1.127  Hosts: 62
Network: 192.168.1.128  Broadcast: 192.168.1.191  Hosts: 62
Network: 192.168.1.192  Broadcast: 192.168.1.255  Hosts: 62`,
        },
        resources: [
          {
            title: 'Subnet Calculator — subnet-calculator.com',
            url: 'https://www.subnet-calculator.com/',
            description: 'Fast, accurate subnet calculator. Use it to verify your manual calculations and explore CIDR notation.',
          },
          {
            title: 'CIDR.xyz — Interactive IP/CIDR Visualiser',
            url: 'https://cidr.xyz/',
            description: 'Visual representation of CIDR blocks — extremely helpful for building intuition about how subnets divide address space.',
          },
          {
            title: 'RFC 4632 — CIDR: The Internet Address Assignment and Aggregation Plan',
            url: 'https://datatracker.ietf.org/doc/html/rfc4632',
            description: 'The IETF RFC that formalised CIDR notation — important background reading for understanding why /xx notation exists.',
          },
        ],
      },
      {
        id: 6,
        slug: 'day-6',
        title: 'Ports & Protocols',
        learn: [
          'What a port number is: a 16-bit integer (0–65535) that identifies a specific process or service on a machine. IP gets you to the right computer; the port gets you to the right application.',
          'Port categories: Well-Known (0–1023, reserved for system services), Registered (1024–49151), Dynamic/Ephemeral (49152–65535, used by clients for outgoing connections).',
          'Essential well-known ports: 20/21 FTP, 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 3389 RDP.',
          'Protocol deep-dives: HTTP (stateless, plaintext), HTTPS (HTTP over TLS), SSH (encrypted remote shell), FTP (file transfer, avoid in favour of SFTP), SMTP (email sending).',
          'The difference between TCP ports (connection-oriented, reliable) and UDP ports (connectionless — used by DNS, NTP, video streaming).',
        ],
        doLab: [
          'On Windows, open an elevated Command Prompt and run: `netstat -ano`. On Linux, run: `sudo netstat -tulpn` or `sudo ss -tulpn`.',
          'Identify at least 5 open ports on your machine and look up what service each corresponds to (use the IANA registry linked below).',
          'Try to find which process ID (PID) owns a specific port, then match it to a process name in Task Manager (Windows) or `ps aux | grep <PID>` (Linux).',
          'On Kali Linux in your VM, run `nmap -sV localhost` to see what services are running locally.',
        ],
        example: {
          title: 'Reading netstat Output — Identifying Open Ports and Services',
          prose: `Here is annotated \`netstat\` output from both Windows and Linux showing how to interpret each column:`,
          code: `# Windows: netstat -ano
# Proto  Local Address      Foreign Address    State        PID
  TCP    0.0.0.0:135        0.0.0.0:0          LISTENING    1124   ← RPC Endpoint Mapper (Windows)
  TCP    0.0.0.0:445        0.0.0.0:0          LISTENING    4      ← SMB (Windows File Sharing) — SYSTEM
  TCP    0.0.0.0:3389       0.0.0.0:0          LISTENING    1036   ← RDP — Remote Desktop Protocol
  TCP    127.0.0.1:1433     0.0.0.0:0          LISTENING    3456   ← SQL Server (local only)
  TCP    192.168.1.105:54321 93.184.216.34:443  ESTABLISHED  7890   ← Your browser on HTTPS

# To find what process PID 3456 is on Windows:
# Open Task Manager → Details tab → find PID 3456

# ─────────────────────────────────────────────────────────────
# Linux: sudo ss -tulpn
# Netid  State   Recv-Q Send-Q  Local Address:Port   Process
  tcp    LISTEN  0      128     0.0.0.0:22           sshd    ← SSH server
  tcp    LISTEN  0      80      127.0.0.1:3306       mysqld  ← MySQL (localhost only — good)
  tcp    LISTEN  0      511     0.0.0.0:80           nginx   ← Web server
  udp    UNCONN  0      0       0.0.0.0:53           dnsmasq ← DNS resolver

# Security note: any port listening on 0.0.0.0 is reachable from
# ALL network interfaces (including external). Ports listening on
# 127.0.0.1 are local-only — much safer for database services.`,
        },
        resources: [
          {
            title: 'IANA — Service Name and Transport Protocol Port Number Registry',
            url: 'https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml',
            description: 'The authoritative registry of every well-known and registered port number. Bookmark this.',
          },
          {
            title: 'Cloudflare Learning — What is a Network Port?',
            url: 'https://www.cloudflare.com/learning/network-layer/what-is-a-computer-port/',
            description: 'Clear explanation of ports, the differences between TCP/UDP ports, and common protocols.',
          },
          {
            title: 'MDN Web Docs — Common MIME Types and Protocols',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types',
            description: 'Understanding protocols at the application layer — essential context for web security.',
          },
        ],
      },
      {
        id: 7,
        slug: 'day-7',
        title: 'Wireshark Introduction',
        learn: [
          'What packet capturing (also called "packet sniffing") is: intercepting and recording network traffic as raw bytes, then decoding it into human-readable protocol layers.',
          'Why security professionals use Wireshark: to diagnose network issues, detect anomalous traffic, understand how attacks work, and verify that encryption is actually in place.',
          'How Wireshark\'s display filter language works: `tcp.port == 80`, `dns`, `http.request.method == "GET"`, `ip.addr == 192.168.1.1`.',
          'The difference between promiscuous mode (capture all traffic on the segment, not just traffic addressed to your MAC) and normal capture mode.',
          'Key Wireshark panes: Packet List (top), Packet Details (middle — protocol tree), Packet Bytes (bottom — raw hex).',
        ],
        doLab: [
          'Download and install Wireshark from wireshark.org. On Linux/Kali it is pre-installed: run `sudo wireshark`.',
          'Select your active network interface (e.g. eth0, Wi-Fi) and click the blue shark-fin Start button.',
          'Browse to http://example.com (HTTP, not HTTPS) in a browser — Wireshark will capture the unencrypted traffic.',
          'Stop the capture after 5 minutes. Apply the filter `dns` and find a DNS query. Apply `tcp` and find a TCP handshake (SYN, SYN-ACK, ACK). Apply `http` to see the HTTP request/response.',
        ],
        example: {
          title: 'Annotated Wireshark Capture — DNS Query, TCP Handshake, HTTP Request',
          prose: `After capturing 5 minutes of browsing traffic, here is what you would see in the Wireshark Packet List pane, with annotations:

**Finding a DNS query** (filter: \`dns\`):

| No. | Time | Source | Destination | Protocol | Info |
|-----|------|--------|-------------|----------|------|
| 12 | 0.123 | 192.168.1.105 | 8.8.8.8 | DNS | Standard query A example.com |
| 13 | 0.145 | 8.8.8.8 | 192.168.1.105 | DNS | Standard query response A 93.184.216.34 |

Packet 12: your machine asks Google's DNS (8.8.8.8) "what is the IP for example.com?"
Packet 13: the answer comes back: 93.184.216.34. DNS uses UDP port 53.

**Finding the TCP 3-way handshake** (filter: \`tcp.flags.syn == 1\`):

| No. | Time | Source | Destination | Protocol | Info |
|-----|------|--------|-------------|----------|------|
| 14 | 0.148 | 192.168.1.105 | 93.184.216.34 | TCP | 54000 → 80 [SYN] Seq=0 |
| 15 | 0.201 | 93.184.216.34 | 192.168.1.105 | TCP | 80 → 54000 [SYN, ACK] Seq=0 Ack=1 |
| 16 | 0.202 | 192.168.1.105 | 93.184.216.34 | TCP | 54000 → 80 [ACK] Seq=1 Ack=1 |

This is the TCP 3-way handshake establishing a connection before any HTTP data is sent.

**Finding the HTTP request** (filter: \`http\`):`,
          code: `# In Wireshark Packet Details pane for the HTTP GET packet:
Frame 17: 517 bytes on wire
Ethernet II: src MAC 00:1A:2B:3C:4D:5E → dst MAC (router)
Internet Protocol Version 4:
    Source: 192.168.1.105
    Destination: 93.184.216.34
Transmission Control Protocol: Src Port: 54000, Dst Port: 80
Hypertext Transfer Protocol:
    GET / HTTP/1.1\r\n
    Host: example.com\r\n
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n
    Accept: text/html\r\n
    \r\n
# Notice: NO encryption — this is why HTTP (port 80) is dangerous.
# On HTTPS (port 443) you would see TLS Application Data instead.`,
        },
        resources: [
          {
            title: 'Wireshark — Official Documentation & User Guide',
            url: 'https://www.wireshark.org/docs/wsug_html_chunked/',
            description: 'The official Wireshark user guide. Chapter 6 (Working with Captured Packets) and Chapter 11 (Display Filters) are essential.',
          },
          {
            title: 'Wireshark — Display Filter Reference',
            url: 'https://www.wireshark.org/docs/dfref/',
            description: 'Complete searchable reference for all Wireshark display filter fields — use this to build powerful capture filters.',
          },
        ],
      },
      {
        id: 8,
        slug: 'day-8',
        title: 'Build Your Isolated Lab Network',
        learn: [
          'NAT (Network Address Translation) mode in VirtualBox: the VM can reach the internet via your host, but it is invisible to your LAN. Other VMs cannot talk to it directly.',
          'Host-only networking: the VM gets a private IP on a virtual network shared only between VMs and the host. No internet — perfect for isolated attack/defence practice.',
          'Bridged networking: the VM appears as a full device on your real LAN, gets a DHCP IP from your router. Useful for some scenarios but exposes your lab to your real network.',
          'Why isolation matters: when you run attack tools in an isolated lab, you cannot accidentally scan or disrupt real devices. This is both legal and ethical practice.',
          'How to configure multiple VMs to communicate with each other on a Host-only network.',
        ],
        doLab: [
          'In VirtualBox, go to File → Host Network Manager (or Tools → Network in newer versions). Create a new Host-only adapter if one doesn\'t exist. Note its IP range (e.g. 192.168.56.0/24).',
          'Open your Kali Linux VM settings → Network → Adapter 2. Enable it, set to "Host-only Adapter", select the adapter you just created.',
          'Download a second lightweight VM — Metasploitable 2 (intentionally vulnerable, from SourceForge) or use the Kali Linux .ova again as a second machine.',
          'Configure the second VM\'s network adapter to Host-only as well.',
          'Boot both VMs. Run `ip addr` on each to get their Host-only IPs, then ping from one to the other to confirm isolation and connectivity.',
        ],
        example: {
          title: 'Step-by-Step: Connecting Kali and a Target VM on a Host-only Network',
          prose: `Here is the exact sequence for setting up an isolated two-VM lab in VirtualBox:

**Step 1 — Create the Host-only Network:**
In VirtualBox, open *File → Host Network Manager*. Click "Create". VirtualBox creates vboxnet0 (Linux/macOS) or "VirtualBox Host-Only Ethernet Adapter" (Windows) with a default range of 192.168.56.0/24. The host machine gets 192.168.56.1.

**Step 2 — Assign Host-only Adapter to Kali VM:**
In Kali VM Settings → Network → Adapter 1: keep as NAT (for internet access). Adapter 2: enable, set to "Host-only Adapter", select vboxnet0.

**Step 3 — Assign Host-only Adapter to Target VM (Metasploitable 2):**
In Target VM Settings → Network → Adapter 1: set to "Host-only Adapter", select vboxnet0. No NAT needed — this machine should not have internet access.

**Step 4 — Boot and verify:**`,
          code: `# On Kali Linux VM:
ip addr show eth1
# Should show: inet 192.168.56.101/24 (DHCP from VirtualBox DHCP server)

# On Metasploitable 2 / Target VM:
ifconfig eth0
# Should show: inet addr: 192.168.56.102  Mask:255.255.255.0

# From Kali, ping the target:
ping -c 4 192.168.56.102
# Expected output:
# PING 192.168.56.102: 56 data bytes
# 64 bytes from 192.168.56.102: icmp_seq=1 ttl=64 time=0.8 ms
# 64 bytes from 192.168.56.102: icmp_seq=2 ttl=64 time=0.7 ms

# Confirm the target CANNOT reach the internet:
# On the target VM:
ping -c 2 8.8.8.8
# Expected: Request timeout — no route to host ✓

# Your isolated lab is now operational.`,
        },
        resources: [
          {
            title: 'VirtualBox Manual — Chapter 6: Virtual Networking',
            url: 'https://www.virtualbox.org/manual/ch06.html',
            description: 'The definitive reference on all VirtualBox networking modes — NAT, Host-only, Bridged, Internal — with diagrams.',
          },
          {
            title: 'Metasploitable 2 — Download (SourceForge)',
            url: 'https://sourceforge.net/projects/metasploitable/',
            description: 'Intentionally vulnerable Linux VM for safe, legal practice. Only ever run it on an isolated Host-only network.',
          },
        ],
      },
      {
        id: 9,
        slug: 'day-9',
        title: 'Review Day — Networking Recap',
        learn: [
          'Synthesise everything from Days 1–8 into a coherent mental model: how data flows from application layer down through the network to another machine and back up.',
          'Identify any gaps in your understanding before moving to Module 2 — it\'s better to solidify foundations now than patch them under pressure later.',
          'Understand the relationship between all the tools you\'ve used: Wireshark captures what netstat reveals is open, on networks you understand from subnetting, reaching hosts you identify via IP addressing.',
          'Practice independently — doing it yourself without looking at the guide is the real test of understanding.',
        ],
        doLab: [
          'Without looking at the guide, find your Kali VM\'s IP address, run a ping to your target VM, and confirm they are on the same /24 subnet.',
          'Open Wireshark on Kali, run a 3-minute capture while pinging the target VM, then stop and identify the ICMP packets in the capture.',
          'Run `netstat -tulpn` on Kali and identify at least 3 open ports and their services.',
          'Check the self-check list below — if any item gives you pause, revisit that day\'s material before proceeding to Module 2.',
        ],
        example: {
          title: 'Self-Check Checklist — One Key Command Per Day',
          prose: `Work through this checklist independently. If you can do each item without help, you are ready for Module 2.`,
          code: `Day 1 ✓ — I can explain the CIA Triad to someone with no tech background.
               Example: "Confidentiality = only you can read your messages.
                         Integrity = the message wasn't changed in transit.
                         Availability = you can always send messages when needed."

Day 2 ✓ — I can boot my Kali Linux VM and run:
               sudo apt update

Day 3 ✓ — I can find my IP and ping my router:
               ip addr show eth0
               ping -c 4 192.168.1.1

Day 4 ✓ — I can open Chrome DevTools Network tab and identify:
               - Remote IP address of a site (Layer 3)
               - Port 443 for HTTPS (Layer 4)
               - HTTP GET request (Layer 7)

Day 5 ✓ — I can manually calculate: "How many /26 subnets fit in a /24?"
               Answer: 4 subnets, 62 usable hosts each.

Day 6 ✓ — I can run netstat and identify which PID owns port 22:
               sudo ss -tulpn | grep :22

Day 7 ✓ — I can open Wireshark, start a capture, apply filter 'dns',
               and find at least one DNS query packet.

Day 8 ✓ — I can ping from Kali to my target VM on 192.168.56.x
               and confirm the target cannot reach 8.8.8.8.

Day 9 ✓ — I completed all 8 checks above without looking at the guide.
               → I am ready for Module 2.`,
        },
        resources: [
          {
            title: 'Day 2 Reference: VirtualBox Downloads',
            url: 'https://www.virtualbox.org/wiki/Downloads',
            description: 'Revisit if you need to reconfigure your VM.',
          },
          {
            title: 'Day 3 Reference: RFC 1918 Private Addresses',
            url: 'https://datatracker.ietf.org/doc/html/rfc1918',
            description: 'Private IP ranges reference.',
          },
          {
            title: 'Day 4 Reference: Cloudflare OSI Model',
            url: 'https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/',
            description: 'OSI layer reference.',
          },
          {
            title: 'Day 7 Reference: Wireshark User Guide',
            url: 'https://www.wireshark.org/docs/wsug_html_chunked/',
            description: 'Full Wireshark reference.',
          },
        ],
      },
    ],
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Threat Landscape',
    subtitle: 'Malware, Attacks & Defence Mindset',
    description:
      'Understand how attackers think, what tools they use, and how defenders counter them. Covers malware taxonomy, common attack vectors, social engineering, and the MITRE ATT&CK framework.',
    dayRange: 'Days 10–18',
    comingSoon: true,
    days: [],
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Web Security Fundamentals',
    subtitle: 'OWASP Top 10, HTTP, and Burp Suite',
    description:
      'Dive into web application security — the most in-demand skill in modern cybersecurity. Learn the OWASP Top 10, intercept and modify HTTP requests with Burp Suite, and understand how XSS, SQLi, and IDOR vulnerabilities work.',
    dayRange: 'Days 19–27',
    comingSoon: true,
    days: [],
  },
];
