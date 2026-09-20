import { Code2, LifeBuoy, PenTool, Rocket, Search, ShieldCheck } from "lucide-react";

export const processSteps = [
  {
    title: "Discovery & Strategy",
    text: "We start by understanding your business goals and analysing the market to create a solid project roadmap.",
    icon: Search,
    tags: ["Requirements", "Roadmap"],
  },
  {
    title: "UI/UX Design",
    text: "Our designers craft intuitive, modern and engaging interfaces tailored to your brand identity.",
    icon: PenTool,
    tags: ["Wireframes", "Prototype"],
  },
  {
    title: "Development",
    text: "Using modern technologies like React, Next.js and Tailwind CSS, we bring the designs to life with clean, well-structured code.",
    icon: Code2,
    tags: ["Frontend", "Backend"],
  },
  {
    title: "Testing & Quality",
    text: "Every feature is tested on real devices and browsers so bugs are caught long before your users find them.",
    icon: ShieldCheck,
    tags: ["QA", "Performance"],
  },
  {
    title: "Deployment",
    text: "We launch on secure, scalable infrastructure and take care of domains, hosting and final go-live checks.",
    icon: Rocket,
    tags: ["Hosting", "Go-live"],
  },
  {
    title: "Support & Growth",
    text: "After launch we monitor, update and improve your product so it keeps growing together with your business.",
    icon: LifeBuoy,
    tags: ["Maintenance", "Updates"],
  },
];