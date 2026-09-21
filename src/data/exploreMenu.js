import { Hammer, Images, Newspaper, UserRound, Users } from "lucide-react";

// Change the menu name here (e.g. "Nova Hub", "Discover")
export const exploreLabel = "Explore";

export const exploreItems = [
  {
    slug: "ongoing-projects",
    live: true,
    href: "/ongoing-projects",
    label: "Ongoing Projects",
    icon: Hammer,
    short: "See what we are building right now",
    title: "Ongoing Projects",
    description:
      "A live look at the products our team is currently designing and developing.",
    points: [
      "Progress updates on active projects",
      "Behind-the-scenes previews",
      "Estimated launch timelines",
    ],
  },
  {
    slug: "blog",
    live: true,
    href: "/blog",
    label: "Blog",
    icon: Newspaper,
    short: "Articles, guides and tech insights",
    title: "Blog",
    description:
      "Practical articles on software, design and technology from the Nova Solutions team.",
    points: [
      "Development tips and tutorials",
      "Product and design insights",
      "Company news and announcements",
    ],
  },
  {
    slug: "team",
    live: true,
    href: "/team",
    label: "Developer Team",
    icon: Users,
    short: "Meet the people behind our work",
    title: "Meet Our Developer Team",
    description:
      "The developers, designers and engineers who turn ideas into working software.",
    points: [
      "Team member profiles and photos",
      "Skills and areas of expertise",
      "Life inside the team",
    ],
  },
  {
    slug: "gallery",
    live: true,
    href: "/gallery",
    label: "Gallery",
    icon: Images,
    short: "Photos from our events and office",
    title: "Gallery",
    description:
      "Moments from our office, events, workshops and team activities.",
    points: [
      "Event and workshop photos",
      "Office and team moments",
      "Milestones and celebrations",
    ],
  },
  {
    slug: "ceo",
    live: true,
    href: "/ceo",
    label: "CEO's Corner",
    icon: UserRound,
    short: "A message and photos from our CEO",
    title: "CEO's Corner",
    description:
      "A personal message from our CEO about our vision, values and the road ahead.",
    points: [
      "A message from the CEO",
      "Vision and company values",
      "Official photos",
    ],
  },
];