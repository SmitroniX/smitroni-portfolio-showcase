export interface Project {
  id: string;
  title: string;
  category: 'Full Stack' | 'Cloud & API' | 'AI & CLI' | 'Systems & Bots';
  tagline: string;
  description: string;
  features: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  status: string;
  gradient: string;
  badge: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  highlights: string[];
  tech: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  description: string;
  skills: { name: string; level: number; highlight?: boolean }[];
}

export const PERSONAL_INFO = {
  name: "Asmit Jogdand",
  handle: "SmitroniX",
  title: "Full Stack & Cloud Systems Engineer",
  roles: [
    "Cloud Computing Architect",
    "Full Stack Web Sorcerer",
    "Python & Systems Hacker",
    "Discord Bot & Concurrency Engineer",
    "AI CLI Tool Builder"
  ],
  bio: "Cloud Computing student at RAIT, Python wizard, React & Node.js aficionado. Crafting resilient web applications, ultra-fast APIs, and mastering high-scale distributed systems.",
  quote: "Code with purpose. Learn without limits. Build what matters.",
  location: "Mumbai, Maharashtra, India",
  email: "jogdandasmit@gmail.com",
  education: {
    degree: "Bachelor of Technology in Computer Engineering",
    institution: "Ramrao Adik Institute of Technology (RAIT), DYPU",
    year: "2025 — 2029",
    score: "ICSE General Studies: 85.7%"
  },
  socials: {
    github: "https://github.com/SmitroniX",
    linkedin: "https://www.linkedin.com/in/asmit-jogdand",
    leetcode: "https://leetcode.com/u/SmitroniX/",
    hackerrank: "https://www.hackerrank.com/jogdandasmit",
    instagram: "https://www.instagram.com/asmit.jogdand_pvt",
    website: "https://smitronix.dev"
  },
  metrics: [
    { label: "Public Repos", value: "52+", detail: "GitHub verified" },
    { label: "Production Apps", value: "15+", detail: "Deployed & active" },
    { label: "System Uptime", value: "99.9%", detail: "Cloud bots & APIs" },
    { label: "Code Mastery", value: "4+ Yrs", detail: "Self-driven engineering" }
  ]
};

export const PROJECTS: Project[] = [
  {
    id: "dypu-connect",
    title: "DYPU Connect",
    category: "Full Stack",
    tagline: "Exclusive Campus Social Platform for DY Patil University",
    description: "A comprehensive digital ecosystem built exclusively for university students. Features secure student verification, anonymous confession feeds, student marketplace, clubs discovery, real-time encrypted messaging, and campus event hubs.",
    features: [
      "Real-time WebSocket chat and push notification dispatchers",
      "Anonymous Confessions module with AI moderation filter",
      "P2P Student Marketplace for academic materials and tech",
      "Club, community, and university event tracking board"
    ],
    techStack: ["React", "TypeScript", "Node.js", "Firebase", "MongoDB", "TailwindCSS"],
    githubUrl: "https://github.com/SmitroniX/DYPU-Connect",
    liveUrl: "https://dypu-connect.netlify.app",
    featured: true,
    status: "Active Production",
    gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    badge: "Flagship Platform"
  },
  {
    id: "aniplex-reader",
    title: "AniDex & AniPlex",
    category: "Full Stack",
    tagline: "Next-Gen Anime Streaming & Manga Reader Hub",
    description: "A lightning-fast streaming and manga reader inspired by modern OTT interfaces. Integrates high-speed content scraping engines, adaptive stream resolution, bookmarking sync, and responsive mobile-first UI.",
    features: [
      "Fluid manga reader with infinite vertical scroll and page preloading",
      "Multi-server streaming proxy with sub-second buffering",
      "Personalized watchlist, progress tracker, and search filters",
      "Consumet API aggregation with fallback failover"
    ],
    techStack: ["React.js", "Consumet API", "Node.js", "Firebase", "TailwindCSS"],
    githubUrl: "https://github.com/SmitroniX/AniPlex",
    liveUrl: "https://ani-plex.vercel.app",
    featured: true,
    status: "Active Deployment",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    badge: "High Traffic App"
  },
  {
    id: "shadowplex-api",
    title: "ShadowPlex & Shadow_API",
    category: "Cloud & API",
    tagline: "High-Throughput Entertainment Search Engine & Media Engine",
    description: "Ultra low-latency Node/TypeScript RESTful microservice scraping and indexing multimedia metadata across top providers. Powers frontend cinema web apps with caching and automated rate limiting.",
    features: [
      "Multi-provider media scraping pipeline with Redis cache layer",
      "Automated payload sanitization and sub-150ms response times",
      "CORS-ready REST endpoints with granular documentation",
      "Containerized microservice architecture deployed on serverless nodes"
    ],
    techStack: ["TypeScript", "Node.js", "Express", "Cheerio", "Vercel Serverless"],
    githubUrl: "https://github.com/SmitroniX/shadow_api",
    liveUrl: "https://shadowapi-bice.vercel.app",
    featured: true,
    status: "Production API",
    gradient: "from-purple-500/20 via-indigo-500/10 to-transparent",
    badge: "Microservice Engine"
  },
  {
    id: "gemini-cli",
    title: "GhostCLI & Gemini CLI",
    category: "AI & CLI",
    tagline: "Autonomous AI Developer Terminal Companion",
    description: "Brings the power of Google Gemini AI directly into your UNIX terminal. Streamlines shell command generation, git diff explanations, code reviews, and automated debugging workflows right from the prompt.",
    features: [
      "Context-aware CLI shell command generation with auto-explain",
      "Streaming markdown syntax rendering right in the terminal window",
      "Interactive multi-turn conversation memory with zero latency",
      "Custom system prompt presets for DevOps, Python, and WebDev"
    ],
    techStack: ["TypeScript", "Node.js", "Google Gemini API", "Commander.js", "Chalk"],
    githubUrl: "https://github.com/SmitroniX/gemini-cli",
    liveUrl: "https://geminicli.com",
    featured: true,
    status: "Open Source Tool",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    badge: "AI Terminal Agent"
  },
  {
    id: "smitrix",
    title: "SmiTriX Digital Matrix",
    category: "AI & CLI",
    tagline: "Cyberpunk Digital Sandbox & Matrix Engine",
    description: "An interactive browser-based cyberpunk matrix interface. Features real-time visual code generation, audio-reactive canvas rain, command-line simulations, and hacker terminal games.",
    features: [
      "Custom 60FPS WebGL/Canvas Matrix rain simulator with green glow trails",
      "Interactive hacker console with system diagnostics and mini-games",
      "Synthesized sound feedback using HTML5 Web Audio API",
      "Optimized for high frame rates on both mobile and desktop GPUs"
    ],
    techStack: ["JavaScript", "HTML5 Canvas", "Web Audio API", "CSS3 Animations"],
    githubUrl: "https://github.com/SmitroniX/SmiTriX",
    liveUrl: "https://smitronix.github.io/SmiTriX/",
    featured: false,
    status: "Live Experience",
    gradient: "from-lime-500/20 via-green-500/10 to-transparent",
    badge: "Creative Tech"
  },
  {
    id: "plexstaff-bots",
    title: "PlexStaff & High-Concurrency Bots",
    category: "Systems & Bots",
    tagline: "Distributed Discord Management & Event Dispatchers",
    description: "Enterprise-grade Discord automation bots managing communities with tens of thousands of members. Handles automated verification, moderation triage, voice-channel dynamic provisioning, and analytics.",
    features: [
      "Discord.js v14 gateway sharding architecture for high concurrency",
      "Automated member safety protocols and anti-raid heuristics",
      "Integrated SQLite/MongoDB persistence for tickets and warnings",
      "Custom dashboard integration via secure OAuth2"
    ],
    techStack: ["JavaScript", "Node.js", "Discord.js", "MongoDB", "REST APIs"],
    githubUrl: "https://github.com/SmitroniX/PlexStaff",
    liveUrl: "https://github.com/SmitroniX",
    featured: false,
    status: "Deployed Systems",
    gradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    badge: "Bot Architecture"
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Frontend & Creative UI",
    icon: "Layout",
    description: "Crafting fluid, high-performance interfaces and 3D web experiences.",
    skills: [
      { name: "React.js", level: 95, highlight: true },
      { name: "TypeScript", level: 90, highlight: true },
      { name: "Tailwind CSS", level: 95, highlight: true },
      { name: "Three.js & Canvas", level: 85, highlight: true },
      { name: "Next.js", level: 80 },
      { name: "HTML5 / Modern CSS", level: 98 }
    ]
  },
  {
    title: "Backend & Distributed Systems",
    icon: "Server",
    description: "Building resilient microservices, robust REST APIs, and event-driven architectures.",
    skills: [
      { name: "Node.js & Express", level: 92, highlight: true },
      { name: "Python", level: 95, highlight: true },
      { name: "RESTful API Design", level: 94, highlight: true },
      { name: "WebSockets & Real-time", level: 86 },
      { name: "Java", level: 82 },
      { name: "Discord.js Architecture", level: 96, highlight: true }
    ]
  },
  {
    title: "Cloud & Infrastructure",
    icon: "Cloud",
    description: "Deploying, containerizing, and orchestrating serverless and scalable cloud workloads.",
    skills: [
      { name: "AWS (EC2, S3, Lambda)", level: 82, highlight: true },
      { name: "Firebase Suite", level: 88, highlight: true },
      { name: "Docker & Containerization", level: 78 },
      { name: "Linux Administration", level: 88 },
      { name: "Vercel / Netlify CI/CD", level: 92 },
      { name: "Git & Version Control", level: 95, highlight: true }
    ]
  },
  {
    title: "Databases & Algorithms",
    icon: "Database",
    description: "Optimizing database schemas and sharpening competitive algorithmic problem solving.",
    skills: [
      { name: "MongoDB", level: 90, highlight: true },
      { name: "MySQL / Relational DBs", level: 84 },
      { name: "Redis Caching", level: 80 },
      { name: "Data Structures & DSA", level: 88, highlight: true },
      { name: "Competitive Programming", level: 82 },
      { name: "System Design Fundamentals", level: 85 }
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    role: "Web Development Intern",
    company: "Naviotech Solution Pvt Ltd",
    period: "2026 — Present",
    type: "Internship",
    location: "Mumbai / Remote",
    highlights: [
      "Engineered production-grade web applications utilizing React.js and Node.js microservices.",
      "Spearheaded REST API optimization, reducing response payloads and endpoint latencies by 28%.",
      "Collaborated on full-stack architecture, database schema migrations, and authentication flows."
    ],
    tech: ["React.js", "Node.js", "REST APIs", "Full Stack Engineering", "TailwindCSS"]
  },
  {
    role: "Marketing & Operations Lead",
    company: "Social Wing RAIT",
    period: "2025 — Present",
    type: "Leadership & Community",
    location: "Ramrao Adik Institute of Technology",
    highlights: [
      "Coordinated campus-wide tech conferences, hackathons, and student community drives.",
      "Engineered social campaigns and digital awareness reaching 2,500+ engineering students.",
      "Facilitated cross-functional collaboration between student developers and academic committees."
    ],
    tech: ["Community Building", "Event Architecture", "Public Relations", "Team Leadership"]
  },
  {
    role: "Freelance Software & Systems Engineer",
    company: "Self-Employed",
    period: "2024 — 2025",
    type: "Freelance",
    location: "Remote / Global",
    highlights: [
      "Designed and deployed custom Discord automation bots handling 50k+ server interactions monthly.",
      "Engineered custom web scrapers, automation scripts, and microservice APIs for international clients.",
      "Maintained 99.9% uptime across independent server nodes and AWS instances."
    ],
    tech: ["Python", "Node.js", "Discord.js", "Automation", "AWS EC2", "MongoDB"]
  },
  {
    role: "Plugin Developer (Part-Time)",
    company: "Hypixel Inc Ecosystem",
    period: "2023 — 2024",
    type: "Game Systems & Performance",
    location: "Remote",
    highlights: [
      "Developed high-efficiency Java server plugins for multiplayer game servers.",
      "Profiled and optimized server tick-rates (TPS), garbage collection spikes, and packet handling.",
      "Implemented custom game mechanics, anti-cheat detection routines, and event listeners."
    ],
    tech: ["Java", "Bukkit / Spigot API", "Packet Optimization", "High Concurrency"]
  },
  {
    role: "AI & Software Testing Intern",
    company: "Tech QA Labs",
    period: "2023",
    type: "Internship",
    location: "Remote",
    highlights: [
      "Tested AI prompt generation engines, edge-case failure detection, and LLM hallucination checks.",
      "Executed manual & automated test suites across cross-browser environments.",
      "Reported over 120+ functional bugs with reproducible trace logs and patch recommendations."
    ],
    tech: ["AI Testing", "Quality Assurance", "Bug Triage", "Test Automation"]
  }
];

export const CERTIFICATIONS = [
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    year: "2026",
    credentialUrl: "https://www.linkedin.com/in/asmit-jogdand",
    skills: ["Data Analytics", "Business Intelligence", "Python Insights"]
  },
  {
    title: "The Complete Web Development Bootcamp",
    issuer: "Udemy",
    year: "2024",
    credentialUrl: "https://www.linkedin.com/in/asmit-jogdand",
    skills: ["React", "Node.js", "Express", "MongoDB", "REST APIs"]
  }
];

export const FUN_FACTS = [
  "⚡ Python is my absolute favorite language for algorithmic brilliance.",
  "🌩 Cloud computing & high-concurrency distributed systems fascinate me deeply.",
  "🚀 I love shipping products from zero to production in record time.",
  "🎮 Gaming and game server mechanics heavily inspired my initial coding journey.",
  "☕ Debugging complex asynchronous race conditions is better with hot coffee."
];
