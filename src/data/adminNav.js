import {
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export const adminNav = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview of your website",
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
    description: "Add, edit and remove projects",
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: Inbox,
    description: "Contact form inbox",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Site and account settings",
  },
];