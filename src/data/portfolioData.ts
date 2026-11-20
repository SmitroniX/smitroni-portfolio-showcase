export interface Project {
  id: string;
  title: string;
  category: 'Full Stack' | 'Cloud & API' | 'Developer Tools' | 'Systems & Bots' | 'Systems & Engine';
  tagline: string;
  description: string;
  story: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: string;
  stats?: { label: string; value: string };
  previewType: 'dypu' | 'aniplex' | 'shadow' | 'cli' | 'discord' | 'shadowlauncher' | 'smitrix' | 'compiler';
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  description: string;
  highlights: string[];
  skills: string[];
  credentialId?: string;
  credentialUrl?: string;
  badge?: string;
}

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  credentialId?: string;
  link: string;
}

export interface SkillItem {
  name: string;
  tag: string;
  exp: 'Core' | 'Advanced' | 'Proficient' | 'Active';
  proficiency: number;
  detail: string;
}

export interface SkillDomain {
  id: string;
  title: string;
  shortTitle: string;
  desc: string;
  accent: 'orange' | 'cyan' | 'emerald' | 'amber';
  score: number;
  items: SkillItem[];
}

export interface RadarAxis {
  id: string;
  label: string;
  shortLabel: string;
  score: number;
  summary: string;
  topSkills: string[];
}

export const PERSONAL_INFO = {
  name: "Asmit Jogdand",
  handle: "SmitroniX",
  role: "Full-Stack Software Engineer & Systems Builder",
  rotatingRoles: [
    "Full-Stack Software Engineer",
    "Native C++ & Java Systems Builder",
    "Cloud & DevOps Architect",
    "HTB CTF Team Captain (#331386)",
  ],
  headline: "Crafting scalable web platforms, high-throughput microservices, and native systems engines.",
  shortBio: "Computer Engineering student at Ramrao Adik Institute of Technology (RAIT), Mumbai University. Maintaining an 8.65 CGPA, founding captain of CTF team sudo Unknown (#331386), and builder of high-performance distributed systems.",
  location: "Mumbai, Maharashtra, India",
  timezone: "Asia/Kolkata",
  email: "jogdandasmit@gmail.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/142213284?v=4",
  resumeUrl: "/resume.pdf",
  education: {
    degree: "B.E. in Computer Engineering (Pursuing)",
    institution: "Ramrao Adik Institute of Technology (RAIT), Mumbai University",
    department: "Department of Computer Engineering",
    year: "2025 — 2029",
    cgpa: "8.65",
    sem1: "8.80",
    sem2: "8.50",
    grade: "CGPA 8.65 (Sem 1: 8.80 | Sem 2: 8.50)",
    hsc: "78.40%",
    hscBoard: "Maharashtra State Board (HSC)",
    icse: "85.70%",
    icseSchool: "St. Ann's School, Beed (CISCE)"
  },
  socials: {
    github: "https://github.com/SmitroniX",
    linkedin: "https://www.linkedin.com/in/asmit-jogdand",
    leetcode: "https://leetcode.com/u/SmitroniX/",
    hackerrank: "https://www.hackerrank.com/jogdandasmit",
    instagram: "https://www.instagram.com/asmit.jogdand_pvt",
    portfolio: "https://smitronix.dev",
    hackthebox: "https://app.hackthebox.com/teams/overview/331386"
  },
  stats: [
    { label: "Public Repos", value: "52+", numeric: 52, suffix: "+", note: "Open-source GitHub" },
    { label: "Academic CGPA", value: "8.65", numeric: 8.65, decimals: 2, suffix: "", note: "RAIT Mumbai Univ." },
    { label: "Native Engine", value: "138 FPS", numeric: 138, suffix: " FPS", note: "120Hz GL4ES core" },
    { label: "Cloud Uptime", value: "99.9%", numeric: 99.9, decimals: 1, suffix: "%", note: "50K+ users served" }
  ],
  currently: {
    building: "DYPU Connect v2 & ShadowLauncher Native Engine",
    listening: "Lofi Beats for deep engineering sessions",
    learning: "GLIBC heap exploitation & distributed consensus",
    available: "Open for SWE Internships & Systems Contracts"
  },
  ctfDisciplines: ["Web", "Pwn", "Crypto", "Forensics", "Reverse", "Misc", "Cloud"],
  spokenLanguages: ["English", "Hindi", "Marathi"]
};

export const PROJECTS: Project[] = [
  {
    id: "shadowlauncher",
    title: "ShadowLauncher — Native Android Engine",
    category: "Systems & Engine",
    tagline: "Android native gaming engine core with C/C++ bridges (GL4ES, LWJGL3) & 138 FPS",
    description: "Engineered native Android launcher core with custom touch HUDs, dynamic RAM allocation, and optimized C/C++ graphics bridges. Achieved 138 FPS (120Hz locked) with sub-8ms touch response latency.",
    story: "Engineered to deliver desktop-grade game emulation on mobile architectures by bypassing standard JNI overhead with high-performance C++ OpenGL translation layers.",
    highlights: [
      "High-performance GL4ES and LWJGL3 C/C++ native bridge integration",
      "Ultra-responsive touch HUD with sub-8ms latency and multi-touch gestures",
      "138 FPS locked on 120Hz high-refresh displays",
      "Dynamic RAM management preventing Out-Of-Memory crashes on low-spec hardware"
    ],
    techStack: ["Java 21", "C / C++", "GL4ES", "LWJGL3", "Android NDK", "OpenGL ES"],
    githubUrl: "https://github.com/SmitroniX/ShadowLauncher",
    status: "Active Engine",
    stats: { label: "Performance", value: "138 FPS (120Hz)" },
    previewType: "shadowlauncher"
  },
  {
    id: "compiler",
    title: "Code With SmitroniX — Cloud IDE",
    category: "Developer Tools",
    tagline: "Cloud IDE with authentic Windows 11 Java Swing/AWT desktop runner & lab reports",
    description: "Full-screen cloud IDE supporting Java (Swing & AWT virtual GUI desktop), Python, C++, C, JavaScript, TypeScript, Rust, Go, and Bash with real-time interactive terminal and academic lab report PDF export.",
    story: "Built to eliminate setup friction for computer engineering students by providing zero-install desktop Java GUI execution and automated lab report documentation directly in the browser.",
    highlights: [
      "Authentic Windows 11 window manager with draggable Java Swing/AWT GUI rendering",
      "Instant multi-language execution across 9 programming languages",
      "Academic lab report generator with code formatting, output capture, and PDF export",
      "Embedded code samples, syntax highlighting, and interactive terminal"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "PrismJS", "Virtual Windowing"],
    liveUrl: "#/compiler",
    githubUrl: "https://github.com/SmitroniX/Code-With-SmitroniX",
    status: "Live on Site",
    stats: { label: "Languages", value: "9 Runtimes" },
    previewType: "compiler"
  },
  {
    id: "dypu-connect",
    title: "DYPU Connect",
    category: "Full Stack",
    tagline: "Exclusive campus social network & P2P marketplace for DY Patil University",
    description: "A complete digital campus hub built from the ground up to connect students across departments. Includes authenticated student accounts, anonymous confession boards, student peer marketplace, clubs showcase, and real-time private chat.",
    story: "I built DYPU Connect to solve fragmented communication across campus. It gave thousands of students an official, secure space to socialize, trade academic resources, and discover college clubs.",
    highlights: [
      "Real-time WebSocket chat and push notifications",
      "Confession feed with community moderation heuristics",
      "P2P marketplace for textbooks, notes, and electronics",
      "Club event feeds with RSVP and announcements"
    ],
    techStack: ["React", "TypeScript", "Node.js", "WebSockets", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/SmitroniX/DYPU-Connect",
    liveUrl: "https://dypu-connect.netlify.app",
    status: "Live in Production",
    stats: { label: "Campus Reach", value: "Active Students" },
    previewType: "dypu"
  },
  {
    id: "smitrix",
    title: "SmiTriX — Privacy-First Fitness PWA",
    category: "Full Stack",
    tagline: "Self-hosted workout PWA with biometric WebAuthn passkeys & zero telemetry",
    description: "Architected privacy-first PWA with 1,324 exercise routines, automated 1RM tracking, biometric WebAuthn passkeys, and zero third-party telemetry.",
    story: "Built as a reaction to commercial fitness apps selling user telemetry. SmiTriX provides gym enthusiasts with local-first, cryptographic privacy and automated strength periodization.",
    highlights: [
      "Biometric WebAuthn passkey authentication with zero-trust local storage",
      "1,324 indexed strength exercises with automated 1RM calculation matrices",
      "100% offline-capable progressive web application with service workers",
      "Zero analytics, zero tracking, and lightweight Docker Compose self-hosting"
    ],
    techStack: ["React 19", "TypeScript", "Tailwind CSS", "Docker Compose", "WebAuthn", "IndexedDB"],
    githubUrl: "https://github.com/SmitroniX/SmiTriX",
    status: "Production PWA",
    stats: { label: "Exercise Catalog", value: "1,324 Routines" },
    previewType: "smitrix"
  },
  {
    id: "shadow-api",
    title: "Shadow_API & ShadowPlex",
    category: "Cloud & API",
    tagline: "High-throughput media indexing microservice & streaming engine",
    description: "A low-latency RESTful microservice scraping and indexing multimedia metadata across entertainment providers. Powers client frontends with Redis caching and automated rate-limiting.",
    story: "Engineered to handle high-frequency concurrent requests while maintaining response latencies under 150ms through in-memory caching and optimized HTTP pipelines.",
    highlights: [
      "Multi-provider media scraping pipeline with Redis caching",
      "Clean RESTful endpoints with automatic rate limiting",
      "Payload sanitization and sub-150ms response benchmarks",
      "Deployable as serverless functions or containerized nodes"
    ],
    techStack: ["TypeScript", "Node.js", "Express", "Cheerio", "Redis", "Vercel"],
    githubUrl: "https://github.com/SmitroniX/shadow_api",
    liveUrl: "https://shadowapi-bice.vercel.app",
    status: "Production API",
    stats: { label: "Latency", value: "<150ms" },
    previewType: "shadow"
  },
  {
    id: "aniplex",
    title: "AniDex & AniPlex",
    category: "Full Stack",
    tagline: "Streaming & discovery platform inspired by modern OTT interfaces",
    description: "A fast, ad-light anime and manga reader designed for high performance. Features responsive catalog browsing, real-time search, multi-source streaming proxies, and smooth chapter readers.",
    story: "Frustrated by bloated and slow streaming sites, I developed AniPlex with an emphasis on instant page loads, elegant typography, and seamless video playback.",
    highlights: [
      "Dynamic manga reader with smooth page preloading",
      "Adaptive streaming resolution with fallback proxies",
      "Personalized watchlist and progress synchronizer",
      "Consumet API aggregation with sub-second response times"
    ],
    techStack: ["React.js", "Consumet API", "Node.js", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/SmitroniX/AniPlex",
    liveUrl: "https://ani-plex.vercel.app",
    status: "Active Deployment",
    stats: { label: "Performance", value: "98 Lighthouse" },
    previewType: "aniplex"
  }
];

export const RADAR_AXES: RadarAxis[] = [
  {
    id: "languages",
    label: "Languages & DSA",
    shortLabel: "Languages",
    score: 94,
    summary: "Daily problem solving in Java 21, C/C++, Python, and TypeScript with strong algorithmic fundamentals.",
    topSkills: ["Java 21 LTS", "C / C++", "TypeScript", "Python"]
  },
  {
    id: "frontend",
    label: "Frontend & Motion",
    shortLabel: "Frontend",
    score: 92,
    summary: "Production React 19/18 architectures, zero-jank animations, WebGL canvases, and offline PWAs.",
    topSkills: ["React 19", "Next.js", "Tailwind CSS", "Three.js"]
  },
  {
    id: "backend",
    label: "Backend & APIs",
    shortLabel: "Backend",
    score: 90,
    summary: "Low-latency REST microservices, Spring Boot, WebSockets, JWT security, and sharded real-time engines.",
    topSkills: ["Node.js", "Express.js", "Spring Boot", "WebSockets"]
  },
  {
    id: "systems",
    label: "Systems & Native",
    shortLabel: "Systems",
    score: 88,
    summary: "JNI/NDK native bridges, GL4ES/LWJGL3 graphics pipelines, JVM GC tuning, and Linux administration.",
    topSkills: ["Android NDK", "GL4ES / LWJGL3", "JVM Tuning", "Linux"]
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    shortLabel: "Cloud/Ops",
    score: 86,
    summary: "Multi-stage Docker containers, AWS EC2/S3 deployments, GitHub Actions CI/CD, and Cloudflare edge.",
    topSkills: ["Docker", "AWS EC2/S3", "GitHub Actions", "Cloudflare"]
  },
  {
    id: "security",
    label: "Security & CTF",
    shortLabel: "Security",
    score: 87,
    summary: "Captaining HTB #331386 across binary exploitation, GLIBC heap research, Burp Suite, and WebAuthn.",
    topSkills: ["GLIBC Heap", "Burp Suite Pro", "Reverse Engg", "WebAuthn"]
  }
];

export const SKILL_DOMAINS: SkillDomain[] = [
  {
    id: "languages",
    title: "Programming Languages",
    shortTitle: "Languages",
    desc: "Preferred core languages & algorithmic foundations",
    accent: "orange",
    score: 94,
    items: [
      { name: "Java (21 LTS)", tag: "Preferred • OOP", exp: "Core", proficiency: 96, detail: "JVM internals, server plugins, multi-threaded pipelines & DSA" },
      { name: "C / C++", tag: "Native Systems", exp: "Advanced", proficiency: 90, detail: "Android NDK bridges, memory management & low-level perf" },
      { name: "TypeScript", tag: "Strict Web", exp: "Core", proficiency: 94, detail: "End-to-end type-safe React & Node.js production architectures" },
      { name: "Python", tag: "Automation & CTF", exp: "Advanced", proficiency: 91, detail: "Exploit scripting, data pipelines, scrapers & AI tooling" },
      { name: "JavaScript (ES6+)", tag: "Web Runtime", exp: "Core", proficiency: 94, detail: "Async runtimes, DOM optimization & service workers" },
      { name: "SQL & Shell / Bash", tag: "Query & Ops", exp: "Proficient", proficiency: 85, detail: "Relational schema optimization & Linux deployment scripts" }
    ]
  },
  {
    id: "frontend",
    title: "Frontend & Interactive UI",
    shortTitle: "Frontend",
    desc: "High-FPS interfaces, PWAs & 3D WebGL experiences",
    accent: "cyan",
    score: 92,
    items: [
      { name: "React 19 / 18", tag: "Primary UI", exp: "Core", proficiency: 95, detail: "35% re-render reduction, custom hooks & concurrent UI" },
      { name: "Next.js", tag: "SSR / Full Stack", exp: "Proficient", proficiency: 84, detail: "App router, edge caching & SEO-optimized platforms" },
      { name: "Tailwind CSS", tag: "Design Systems", exp: "Core", proficiency: 95, detail: "Tokenized dark UIs, responsive layouts & micro-animations" },
      { name: "HTML5 & CSS3", tag: "Semantic Web", exp: "Core", proficiency: 96, detail: "WCAG AA accessibility, GPU keyframes & grid architecture" },
      { name: "Three.js & WebGL", tag: "3D Graphics", exp: "Proficient", proficiency: 82, detail: "Interactive shaders, particle physics & 60FPS canvases" },
      { name: "PWA & WebAuthn", tag: "Local-First", exp: "Advanced", proficiency: 89, detail: "Biometric passkeys, IndexedDB & offline service workers" }
    ]
  },
  {
    id: "backend",
    title: "Backend & Microservices",
    shortTitle: "Backend",
    desc: "High-concurrency APIs, real-time sockets & auth",
    accent: "emerald",
    score: 90,
    items: [
      { name: "Node.js", tag: "Runtime", exp: "Core", proficiency: 93, detail: "Event-driven APIs cutting endpoint latency by 28%" },
      { name: "Express.js", tag: "REST APIs", exp: "Core", proficiency: 92, detail: "Middleware pipelines, rate limiting & JWT/RBAC guards" },
      { name: "Spring Boot", tag: "Java Backend", exp: "Proficient", proficiency: 83, detail: "Enterprise Java REST services & relational persistence" },
      { name: "WebSockets", tag: "Real-time", exp: "Advanced", proficiency: 88, detail: "Bi-directional campus chat & live telemetry streams" },
      { name: "Discord.js Sharding", tag: "Distributed Bots", exp: "Core", proficiency: 95, detail: "Gateway-sharded bots serving 50,000+ community members" },
      { name: "JWT & OAuth / RBAC", tag: "Auth Security", exp: "Advanced", proficiency: 89, detail: "Hardened token lifecycles & strict payload validation" }
    ]
  },
  {
    id: "systems",
    title: "Systems & Native Core",
    shortTitle: "Systems",
    desc: "Graphics translation bridges, NDK & JVM profiling",
    accent: "amber",
    score: 88,
    items: [
      { name: "Android NDK / JNI", tag: "Native Bridge", exp: "Advanced", proficiency: 88, detail: "Bypassing JVM bottlenecks for sub-8ms touch response" },
      { name: "GL4ES & LWJGL3", tag: "OpenGL ES", exp: "Advanced", proficiency: 87, detail: "Desktop OpenGL translation hitting 138 FPS on 120Hz mobile" },
      { name: "JVM & GC Tuning", tag: "Performance", exp: "Advanced", proficiency: 89, detail: "Packet dispatch profiling & tick-rate optimization under load" },
      { name: "Linux / Windows OS", tag: "SysAdmin", exp: "Advanced", proficiency: 90, detail: "Systemd services, networking, shell workflows & debugging" },
      { name: "Memory & Heap Internals", tag: "Low-Level", exp: "Active", proficiency: 84, detail: "Dynamic RAM allocation & GLIBC allocator mechanics" }
    ]
  },
  {
    id: "cloud",
    title: "Cloud, DevOps & Databases",
    shortTitle: "Cloud & DB",
    desc: "Container orchestration, edge delivery & data stores",
    accent: "cyan",
    score: 88,
    items: [
      { name: "Docker & Compose", tag: "Containers", exp: "Advanced", proficiency: 88, detail: "Multi-stage Alpine builds & zero-telemetry self-hosting" },
      { name: "AWS (EC2, S3)", tag: "Cloud Infra", exp: "Proficient", proficiency: 85, detail: "99.9% uptime sharded services & encrypted backups" },
      { name: "MongoDB & MySQL", tag: "NoSQL / SQL", exp: "Advanced", proficiency: 90, detail: "Aggregation pipelines, indexing & relational modeling" },
      { name: "Redis", tag: "In-Memory Cache", exp: "Advanced", proficiency: 86, detail: "Sub-150ms API response caching & pub/sub state sync" },
      { name: "Git, GitHub & CI/CD", tag: "Automation", exp: "Core", proficiency: 94, detail: "GitHub Actions workflows, PR gates & 52+ public repos" },
      { name: "Firebase & Cloudflare", tag: "Edge & Realtime", exp: "Advanced", proficiency: 88, detail: "Edge SSL, DDoS protection, auth & realtime sync" }
    ]
  },
  {
    id: "security",
    title: "Cybersecurity, CTF & DSA",
    shortTitle: "Security",
    desc: "Offensive security research & competitive engineering",
    accent: "orange",
    score: 87,
    items: [
      { name: "Binary Exploitation (Pwn)", tag: "HTB #331386", exp: "Active", proficiency: 87, detail: "GLIBC heap exploitation, ROP & memory corruption research" },
      { name: "Burp Suite Pro", tag: "Web AppSec", exp: "Advanced", proficiency: 89, detail: "Web cache deception, auth auditing & API pentesting" },
      { name: "Reverse Engineering", tag: "ELF / Native", exp: "Proficient", proficiency: 84, detail: "Static/dynamic binary analysis & anti-cheat research" },
      { name: "Cryptography & Forensics", tag: "CTF Ops", exp: "Proficient", proficiency: 83, detail: "Memory dumps, PCAP analysis & cipher cryptanalysis" },
      { name: "DSA & Competitive Coding", tag: "LeetCode / HR", exp: "Active", proficiency: 90, detail: "Active problem solver across graphs, DP & trees" }
    ]
  }
];

export const DEV_TOOLING = [
  { name: "VS Code", role: "Primary IDE" },
  { name: "Linux / Bash", role: "Dev Environment" },
  { name: "Git & GitHub", role: "52+ Public Repos" },
  { name: "Docker Compose", role: "Local & Prod Stack" },
  { name: "Burp Suite Pro", role: "Security Auditing" },
  { name: "LeetCode & HackerRank", role: "Daily DSA" },
  { name: "Oracle ARM64 & AWS", role: "Cloud Nodes" },
  { name: "Hack The Box", role: "Captain #331386" },
];

// Preserved backward-compatible export
export const TECH_STACK = {
  frontend: SKILL_DOMAINS.find((d) => d.id === "frontend")!.items,
  backend: SKILL_DOMAINS.find((d) => d.id === "backend")!.items,
  cloud: SKILL_DOMAINS.find((d) => d.id === "cloud")!.items,
  databases: SKILL_DOMAINS.find((d) => d.id === "security")!.items,
};

export const EXPERIENCES: Experience[] = [
  {
    role: "Web Development Intern",
    company: "Naviotech Solution Pvt. Ltd.",
    period: "Jun 2026 — Aug 2026",
    type: "Internship",
    location: "Remote",
    credentialId: "NTSCS2234",
    credentialUrl: "https://www.linkedin.com/in/asmit-jogdand",
    badge: "Credential ID: NTSCS2234",
    description: "Engineered responsive UI modules and high-performance microservices for client-facing production applications.",
    highlights: [
      "Engineered responsive UI modules in React 18 & TypeScript, slashing unnecessary re-renders by 35%.",
      "Optimized backend REST microservices, reducing endpoint response latency by 28%.",
      "Hardened authentication flows using secure JWT tokens, role-based access control, and payload validation."
    ],
    skills: ["React 18", "TypeScript", "Node.js", "REST APIs", "JWT Security", "Tailwind CSS"]
  },
  {
    role: "Founder & Team Captain",
    company: "sudo Unknown (HTB Team #331386)",
    period: "Sep 2024 — Present",
    type: "Cybersecurity & CTF Team",
    location: "Global / Remote",
    badge: "HTB Team #331386",
    description: "Lead competitive Hack The Box CTF team across 7 disciplines (Web, Pwn, Crypto, Forensics, Reverse, Misc, Cloud).",
    highlights: [
      "Formed and captained competitive CTF roster tackling Hack The Box seasonal challenges and university leagues.",
      "Authored vulnerability research on GLIBC heap exploitation, memory corruption, and web cache deception.",
      "Trained collegiate peers in binary exploitation, memory forensics, and reverse engineering methodologies."
    ],
    skills: ["CTF", "Binary Exploitation", "GLIBC Heap", "Web Security", "Cryptography", "Reverse Engineering"]
  },
  {
    role: "Freelance Systems & Software Engineer",
    company: "Self-Employed",
    period: "2024 — 2025",
    type: "Freelance",
    location: "Remote",
    description: "Designed bespoke automation infrastructure, cloud scrapers, and high-concurrency bot systems for international clients.",
    highlights: [
      "Architected distributed bot infrastructure with gateway sharding on AWS EC2 and Redis caching, supporting 50,000+ active community members with 99.9% uptime.",
      "Built automated data scrapers and custom API integrations for international clients.",
      "Maintained 99.9% uptime on cloud-hosted bots and EC2 nodes."
    ],
    skills: ["Python", "Node.js", "Discord.js", "AWS EC2", "Redis", "MongoDB"]
  },
  {
    role: "Plugin Developer & Server Optimization",
    company: "Hypixel Inc / Ecosystem",
    period: "Jan 2024 — Sep 2025",
    type: "Systems & Optimization",
    location: "Remote",
    description: "Engineered high-throughput Java server extensions, optimizing networking ticks and concurrent packet dispatchers.",
    highlights: [
      "Developed high-efficiency Java server extensions for multiplayer infrastructure under heavy concurrency.",
      "Profiled and optimized server tick-rates (TPS), JVM garbage collection, and packet dispatch pipelines.",
      "Implemented custom game mechanics, anti-cheat detection routines, and event listeners."
    ],
    skills: ["Java 21", "JVM Tuning", "Packet Optimization", "High Concurrency", "Performance Profiling"]
  },
  {
    role: "Marketing & Operations Lead",
    company: "Social Wing RAIT",
    period: "2025 — Present",
    type: "Leadership & Community",
    location: "Ramrao Adik Institute of Technology",
    description: "Leading campus outreach, digital community infrastructure, and technical events for the student body.",
    highlights: [
      "Coordinated campus tech drives, workshops, and community events reaching 2,500+ engineering students.",
      "Managed digital operations, cross-departmental coordination, and social campaigns.",
      "Built collaborative technical spaces for junior engineers to learn web dev and competitive coding."
    ],
    skills: ["Community Building", "Event Operations", "Team Leadership", "Technical Mentorship"]
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: "Certified in Web Development",
    issuer: "Naviotech Solution Pvt. Ltd.",
    year: "Jul 2026",
    credentialId: "NTSCS2234",
    link: "https://www.linkedin.com/in/asmit-jogdand"
  },
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    year: "Jun 2026",
    credentialId: "C9rXmbSJytfjzhKGs",
    link: "https://www.linkedin.com/in/asmit-jogdand"
  },
  {
    title: "The Complete Web Development Bootcamp",
    issuer: "Udemy",
    year: "2024",
    link: "https://www.linkedin.com/in/asmit-jogdand"
  }
];
