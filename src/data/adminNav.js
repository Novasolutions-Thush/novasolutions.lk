import {
  FolderKanban,
  Hammer,
  Images,
  Inbox,
  LayoutDashboard,
  Newspaper,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, description: "Overview of your website" },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban, description: "Add, edit and remove projects" },
  { label: "Ongoing", href: "/admin/ongoing", icon: Hammer, description: "Projects you are building right now" },
  { label: "Team", href: "/admin/team", icon: Users, description: "Manage the developer team and leadership" },
  { label: "CEO Page", href: "/admin/ceo", icon: UserRound, description: "Edit the CEO's message and photo" },
  { label: "Blog", href: "/admin/blog", icon: Newspaper, description: "Write and publish articles" },
  { label: "Gallery", href: "/admin/gallery", icon: Images, description: "Upload and organise photos" },
  { label: "Messages", href: "/admin/messages", icon: Inbox, description: "Contact form inbox" },
  { label: "Settings", href: "/admin/settings", icon: Settings, description: "Site and account settings" },
];