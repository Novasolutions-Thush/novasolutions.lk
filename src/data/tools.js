import {
  FaAndroid,
  FaApple,
  FaAws,
  FaCss3Alt,
  FaDocker,
  FaFigma,
  FaGitAlt,
  FaGithub,
  FaHtml5,
  FaJs,
  FaLaravel,
  FaNodeJs,
  FaPhp,
  FaPython,
  FaReact,
  FaWordpress,
} from "react-icons/fa6";
import {
  SiCloudinary,
  SiExpress,
  SiFirebase,
  SiFlutter,
  SiGooglecloud,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiPostgresql,
  SiPostman,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

export const toolCategories = [
  "All",
  "Frontend",
  "Backend",
  "Mobile",
  "Database & Cloud",
  "Tools",
];

export const tools = [
  // Frontend
  { name: "HTML5", icon: FaHtml5, color: "#E34F26", category: "Frontend" },
  { name: "CSS3", icon: FaCss3Alt, color: "#1572B6", category: "Frontend" },
  { name: "JavaScript", icon: FaJs, color: "#F7DF1E", category: "Frontend" },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", category: "Frontend" },
  { name: "React", icon: FaReact, color: "#61DAFB", category: "Frontend" },
  { name: "Next.js", icon: SiNextdotjs, adaptive: true, category: "Frontend" },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", category: "Frontend" },

  // Backend
  { name: "Node.js", icon: FaNodeJs, color: "#5FA04E", category: "Backend" },
  { name: "Express", icon: SiExpress, adaptive: true, category: "Backend" },
  { name: "Python", icon: FaPython, color: "#3776AB", category: "Backend" },
  { name: "PHP", icon: FaPhp, color: "#777BB4", category: "Backend" },
  { name: "Laravel", icon: FaLaravel, color: "#FF2D20", category: "Backend" },

  // Mobile
  { name: "Flutter", icon: SiFlutter, color: "#42A5F5", category: "Mobile" },
  { name: "Android", icon: FaAndroid, color: "#3DDC84", category: "Mobile" },
  { name: "iOS", icon: FaApple, adaptive: true, category: "Mobile" },

  // Database & Cloud
  { name: "Firebase", icon: SiFirebase, color: "#FFCA28", category: "Database & Cloud" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", category: "Database & Cloud" },
  { name: "MySQL", icon: SiMysql, color: "#4479A1", category: "Database & Cloud" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", category: "Database & Cloud" },
  { name: "AWS", icon: FaAws, color: "#FF9900", category: "Database & Cloud" },
  { name: "Google Cloud", icon: SiGooglecloud, color: "#4285F4", category: "Database & Cloud" },

  // Tools
  { name: "Docker", icon: FaDocker, color: "#2496ED", category: "Tools" },
  { name: "Git", icon: FaGitAlt, color: "#F05032", category: "Tools" },
  { name: "GitHub", icon: FaGithub, adaptive: true, category: "Tools" },
  { name: "Vercel", icon: SiVercel, adaptive: true, category: "Tools" },
  { name: "Figma", icon: FaFigma, color: "#F24E1E", category: "Tools" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37", category: "Tools" },
  { name: "WordPress", icon: FaWordpress, color: "#21759B", category: "Tools" },
  { name: "Cloudinary", icon: SiCloudinary, color: "#4F6BED", category: "Tools" },
];