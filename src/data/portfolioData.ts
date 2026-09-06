export interface Project {
  id: string;
  title: string;
  category: 'Full Stack' | 'Cloud & API' | 'Developer Tools' | 'Systems & Bots';
  tagline: string;
  description: string;
  story: string;
  highlights: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: string;
  stats?: { label: string; value: string };
  previewType: 'dypu' | 'aniplex' | 'shadow' | 'cli' | 'discord';
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
}

export const PERSONAL_INFO = {
  name: "Asmit Jogdand",
  handle: "SmitroniX",
  role: "Full-Stack Engineer & Cloud Enthusiast",
  headline: "Crafting scalable web platforms, high-throughput APIs, and modern developer experiences.",
  shortBio: "Computer Engineering student at RAIT, DY Patil University in Mumbai. Experienced in building production web applications, high-concurrency systems, and cloud infrastructure.",
  location: "Mumbai, Maharashtra, India",
  timezone: "Asia/Kolkata",
  email: "jogdandasmit@gmail.com",
  education: {
    degree: "B.Tech in Computer Engineering",
    institution: "Ramrao Adik Institute of Technology (RAIT), DYPU",
    year: "2025 — 2029",
    grade: "ICSE General Studies: 85.7%"
  },
  socials: {
    github: "https://github.com/SmitroniX",
    linkedin: "https://www.linkedin.com/in/asmit-jogdand",
    leetcode: "https://leetcode.com/u/SmitroniX/",
    hackerrank: "https://www.hackerrank.com/jogdandasmit",
    instagram: "https://www.instagram.com/asmit.jogdand_pvt",
    portfolio: "https://smitronix.dev"
  },
  stats: [
    { label: "Public Repos", value: "52+", note: "Active open-source" },
    { label: "Production Apps", value: "15+", note: "Deployed & maintained" },
    { label: "Years Coding", value: "4+", note: "Self-driven engineering" },
    { label: "Cloud Uptime", value: "99.9%", note: "Bots & services" }
  ],
  currently: {
    building: "DYPU Connect v2 & exploring AWS cloud-native patterns",
    listening: "Lofi Beats for deep programming sessions",
    learning: "System design at scale & distributed messaging",
    available: "Open for Software Engineering internships & freelance"
  }
};

export const PROJECTS: Project[] = [
  {
    id: "dypu-connect",
    title: "DYPU Connect",
    category: "Full Stack",
    tagline: "Exclusive campus social network for DY Patil University students",
    description: "A complete digital campus hub built from the ground up to connect students across departments. Includes authenticated student accounts, anonymous confession boards, student peer marketplace, clubs showcase, and real-time private chat.",
    story: "I built DYPU Connect to solve the fragmented communication on our university campus. It gave thousands of students an official, secure space to socialize, trade academic resources, and discover college clubs.",
    highlights: [
      "Real-time WebSocket chat and push notifications",
      "Confession feed with community moderation heuristics",
      "P2P marketplace for textbooks, notes, and electronics",
      "Club event feeds with RSVP and announcements"
    ],
    techStack: ["React", "TypeScript", "Node.js", "Firebase", "MongoDB", "Tailwind CSS"],
    githubUrl: "https://github.com/SmitroniX/DYPU-Connect",
    liveUrl: "https://dypu-connect.netlify.app",
    status: "Live in Production",
    stats: { label: "Campus Reach", value: "Active Users" },
    previewType: "dypu"
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
  },
  {
    id: "shadow-api",
    title: "Shadow_API & ShadowPlex",
    category: "Cloud & API",
    tagline: "High-throughput media indexing microservice & streaming engine",
    description: "A low-latency RESTful microservice scraping and indexing multimedia metadata across entertainment providers. Powers client frontends with caching and automated rate-limiting.",
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
    id: "gemini-cli",
    title: "GhostCLI & Gemini CLI",
    category: "Developer Tools",
    tagline: "Terminal AI companion integrating Google Gemini into shell workflows",
    description: "An open-source terminal developer utility that brings Google Gemini AI into your shell. Automates bash command generation, explains code and git diffs, and assists debugging without switching context.",
    story: "Built to eliminate the friction of context-switching between the terminal and browser while debugging Linux server errors and writing complex shell scripts.",
    highlights: [
      "Context-aware shell command generation with auto-explain",
      "Streaming markdown syntax rendering right in the terminal",
      "Zero-latency multi-turn interactive session memory",
      "Custom system prompt presets for DevOps, Python, and WebDev"
    ],
    techStack: ["TypeScript", "Node.js", "Google Gemini API", "Commander.js"],
    githubUrl: "https://github.com/SmitroniX/gemini-cli",
    liveUrl: "https://geminicli.com",
    status: "Open Source Tool",
    stats: { label: "Terminal Tool", value: "CLI Native" },
    previewType: "cli"
  },
  {
    id: "plexstaff-bots",
    title: "PlexStaff & High-Concurrency Bots",
    category: "Systems & Bots",
    tagline: "Distributed Discord automation bots managing 50k+ server members",
    description: "Enterprise-grade Discord automation bots managing large community servers. Handles automated verification, ticket triage, voice-channel dynamic allocation, and moderation logs.",
    story: "Scaled from a simple utility bot into a distributed system handling over 50,000 active server members with zero downtime and sub-second reaction times.",
    highlights: [
      "Discord.js v14 gateway sharding architecture",
      "Automated member safety protocols and anti-raid heuristics",
      "Persistent ticket storage with SQLite/MongoDB",
      "High reliability with 99.9% uptime"
    ],
    techStack: ["Node.js", "JavaScript", "Discord.js", "MongoDB", "REST APIs"],
    githubUrl: "https://github.com/SmitroniX/PlexStaff",
    liveUrl: "https://github.com/SmitroniX",
    status: "Production Bots",
    stats: { label: "Community", value: "50k+ Users" },
    previewType: "discord"
  }
];

export const TECH_STACK = {
  frontend: [
    { name: "React.js", tag: "Primary UI", exp: "Advanced" },
    { name: "TypeScript", tag: "Type Safety", exp: "Advanced" },
    { name: "Next.js", tag: "Full Stack", exp: "Proficient" },
    { name: "Tailwind CSS", tag: "Styling", exp: "Advanced" },
    { name: "Three.js / WebGL", tag: "3D & Canvas", exp: "Intermediate" },
    { name: "HTML5 / Modern CSS", tag: "Standards", exp: "Mastery" }
  ],
  backend: [
    { name: "Node.js", tag: "Runtime", exp: "Advanced" },
    { name: "Express.js", tag: "REST APIs", exp: "Advanced" },
    { name: "Python", tag: "Scripting & AI", exp: "Advanced" },
    { name: "Java", tag: "Systems & OOP", exp: "Proficient" },
    { name: "WebSockets", tag: "Real-time", exp: "Proficient" },
    { name: "Discord.js", tag: "Bot Engine", exp: "Mastery" }
  ],
  cloud: [
    { name: "AWS (EC2, S3, Lambda)", tag: "Cloud Infrastructure", exp: "Intermediate" },
    { name: "Firebase Suite", tag: "Auth & Realtime", exp: "Advanced" },
    { name: "Docker", tag: "Containers", exp: "Intermediate" },
    { name: "Linux / Shell", tag: "SysAdmin", exp: "Advanced" },
    { name: "Vercel / Netlify", tag: "CI/CD & Edge", exp: "Advanced" },
    { name: "Git & GitHub", tag: "Collaboration", exp: "Advanced" }
  ],
  databases: [
    { name: "MongoDB", tag: "NoSQL", exp: "Advanced" },
    { name: "MySQL / SQL", tag: "Relational", exp: "Proficient" },
    { name: "Redis", tag: "In-Memory Cache", exp: "Intermediate" },
    { name: "DSA & Algorithms", tag: "Problem Solving", exp: "Active Practice" }
  ]
};

export const EXPERIENCES: Experience[] = [
  {
    role: "Web Development Intern",
    company: "Naviotech Solution Pvt Ltd",
    period: "2026 — Present",
    type: "Internship",
    location: "Mumbai, India",
    description: "Contributing to production client applications, modernizing frontend components, and building robust REST endpoints.",
    highlights: [
      "Engineered performant UI modules using React.js and responsive Tailwind styling.",
      "Optimized backend REST endpoints, reducing payload overhead and latency.",
      "Collaborated on database schema design and secure JWT-based authentication flows."
    ],
    skills: ["React.js", "Node.js", "REST APIs", "Full-Stack Development"]
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
    skills: ["Community Building", "Event Operations", "Team Leadership"]
  },
  {
    role: "Freelance Software & Systems Engineer",
    company: "Self-Employed",
    period: "2024 — 2025",
    type: "Freelance",
    location: "Remote",
    description: "Designed bespoke automation infrastructure, cloud scrapers, and high-concurrency bot systems for international clients.",
    highlights: [
      "Architected custom high-concurrency Discord bots handling 50k+ server members with sub-second response times.",
      "Built automated data scrapers and custom API integrations for international clients.",
      "Maintained 99.9% uptime on cloud-hosted bots and EC2 nodes."
    ],
    skills: ["Python", "Node.js", "Discord.js", "AWS EC2", "MongoDB"]
  },
  {
    role: "Plugin Developer (Part-Time)",
    company: "Hypixel Ecosystem",
    period: "2023 — 2024",
    type: "Systems & Optimization",
    location: "Remote",
    description: "Engineered high-throughput Java server extensions, optimizing networking ticks and concurrent packet dispatchers.",
    highlights: [
      "Developed high-efficiency Java server plugins for multiplayer game servers.",
      "Profiled and optimized server tick-rates (TPS), memory allocation, and packet handling under peak loads.",
      "Implemented custom game mechanics, anti-cheat detection routines, and event listeners."
    ],
    skills: ["Java", "Packet Optimization", "High Concurrency", "Performance Profiling"]
  }
];

export const CERTIFICATIONS = [
  {
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    year: "2026",
    link: "https://www.linkedin.com/in/asmit-jogdand"
  },
  {
    title: "The Complete Web Development Bootcamp",
    issuer: "Udemy",
    year: "2024",
    link: "https://www.linkedin.com/in/asmit-jogdand"
  }
];
