// Placeholder gallery: re-uses the existing sample images.
// Replace with real system screenshots from the Admin panel.
const shots = (n) => [
  { url: `/images/projects/project-${n}.jpg`, publicId: "", caption: "Main dashboard" },
  { url: `/images/projects/project-${(n % 6) + 1}.jpg`, publicId: "", caption: "Detail view" },
  { url: `/images/projects/project-${((n + 1) % 6) + 1}.jpg`, publicId: "", caption: "Reports and settings" },
];

export const projects = [
  {
    id: 1,
    category: "Web Application",
    title: "Retail Management System",
    description: "A complete inventory and sales platform for a retail chain.",
    image: "/images/projects/project-1.jpg",
    tech: ["Next.js", "Firebase", "Tailwind CSS"],
    year: "2025",
    duration: "4 months",
    demoUrl: "",
    features: [
      "Live stock levels for every branch",
      "Fast point-of-sale screen with barcode support",
      "Automatic low-stock alerts and purchase orders",
      "Daily, weekly and monthly sales reports",
      "Role-based access for owners, managers and cashiers",
    ],
    longDescription:
      "A retail chain with several branches was managing stock in spreadsheets and paper bills. We built one web platform that connects every branch, so stock, sales and staff are managed in real time.\n\n## The challenge\n\nBranches often ran out of popular items while others held too much stock. Reports took days to prepare and manual billing caused frequent errors.\n\n## Our solution\n\n- Central inventory shared by all branches\n- Point-of-sale that works quickly at the counter\n- Automatic alerts before an item runs out\n- One dashboard for the owner to see every branch\n\n## The result\n\nThe team now works from a single source of truth, and reports that used to take days are ready in seconds.",
    gallery: shots(1),
    clients: [
      {
        name: "Sample Retail Co.",
        industry: "Retail",
        logo: "",
        logoPublicId: "",
        comment: "Placeholder comment: replace with your real client feedback.",
        author: "Operations Manager",
      },
    ],
  },
  {
    id: 2,
    category: "Mobile App",
    title: "Smart Delivery App",
    description: "Real-time order tracking for customers and riders.",
    image: "/images/projects/project-2.jpg",
    tech: ["React Native", "Node.js", "Maps API"],
    year: "2025",
    duration: "5 months",
    demoUrl: "",
    features: [
      "Live rider location on the map",
      "Order status updates with push notifications",
      "Separate apps for customers and riders",
      "Cash and card payment options",
      "Admin panel for restaurants and orders",
    ],
    longDescription:
      "A local delivery business needed a modern way to take orders and show customers exactly where their food is. We designed and built a customer app, a rider app and a management panel.\n\n## The challenge\n\nOrders were taken by phone, riders were hard to coordinate and customers kept calling to ask where their order was.\n\n## Our solution\n\n- A simple ordering flow in the customer app\n- Live tracking from pickup to the door\n- A rider app that shows the best next delivery\n- A panel to manage menus, orders and payouts\n\n## The result\n\nFewer status calls, faster deliveries and a much better experience for customers.",
    gallery: shots(2),
    clients: [
      {
        name: "Sample Delivery Ltd.",
        industry: "Food and Logistics",
        logo: "",
        logoPublicId: "",
        comment: "Placeholder comment: replace with your real client feedback.",
        author: "Founder",
      },
    ],
  },
  {
    id: 3,
    category: "Cloud Platform",
    title: "Hospital Booking Portal",
    description: "Secure online appointment booking with automated reminders.",
    image: "/images/projects/project-3.jpg",
    tech: ["Next.js", "Cloud Functions", "Firestore"],
    year: "2024",
    duration: "6 months",
    demoUrl: "",
    features: [
      "Online appointment booking by doctor and time slot",
      "Automatic SMS and email reminders",
      "Secure patient accounts",
      "Doctor schedule management",
      "Reports for hospital administration",
    ],
    longDescription:
      "A private hospital wanted patients to book appointments without waiting on the phone. We built a secure portal on cloud infrastructure that handles bookings, reminders and doctor schedules.\n\n## The challenge\n\nPhone bookings created long queues, double bookings and many missed appointments.\n\n## Our solution\n\n- Real-time availability for each doctor\n- Reminders sent automatically before each visit\n- Strong access control to protect patient data\n- Simple reports for the administration team\n\n## The result\n\nSmoother front-desk work and fewer missed appointments.",
    gallery: shots(3),
    clients: [
      {
        name: "Sample Care Hospital",
        industry: "Healthcare",
        logo: "",
        logoPublicId: "",
        comment: "Placeholder comment: replace with your real client feedback.",
        author: "Hospital Administrator",
      },
    ],
  },
  {
    id: 4,
    category: "Web Application",
    title: "School Management Portal",
    description: "Attendance, results and parent communication in one place.",
    image: "/images/projects/project-4.jpg",
    tech: ["Next.js", "Firebase", "Cloudinary"],
    year: "2025",
    duration: "5 months",
    demoUrl: "",
    features: [
      "Daily attendance for every class",
      "Exam results and printable report cards",
      "Notices and messages to parents",
      "Timetable and homework management",
      "Separate logins for admin, teachers and parents",
    ],
    longDescription:
      "A school was using several disconnected tools for attendance, marks and announcements. We combined them into one portal that teachers, students and parents can all use.\n\n## The challenge\n\nInformation was scattered across books and files, and parents were rarely updated on time.\n\n## Our solution\n\n- One place for attendance, marks and timetables\n- Report cards generated automatically\n- Instant notices to parents\n- Clear permissions for each type of user\n\n## The result\n\nLess paperwork for teachers and better communication with families.",
    gallery: shots(4),
    clients: [
      {
        name: "Sample International School",
        industry: "Education",
        logo: "",
        logoPublicId: "",
        comment: "Placeholder comment: replace with your real client feedback.",
        author: "Principal",
      },
    ],
  },
  {
    id: 5,
    category: "Mobile App",
    title: "Fitness Tracker App",
    description: "Workout plans, progress charts and daily reminders.",
    image: "/images/projects/project-5.jpg",
    tech: ["Flutter", "Firebase"],
    year: "2024",
    duration: "3 months",
    demoUrl: "",
    features: [
      "Personal workout plans",
      "Progress charts for weight and activity",
      "Daily reminders",
      "Works on Android and iOS from one codebase",
      "Simple coach dashboard",
    ],
    longDescription:
      "A fitness studio wanted to keep members motivated between sessions. We built a cross-platform app with workout plans, progress tracking and friendly reminders.\n\n## The challenge\n\nMembers forgot their routines and coaches had no easy way to follow their progress.\n\n## Our solution\n\n- Clear plans members can follow step by step\n- Charts that show progress over time\n- Reminders that keep people on track\n- A dashboard for coaches\n\n## The result\n\nBetter engagement and an easier job for the coaching team.",
    gallery: shots(5),
    clients: [
      {
        name: "Sample Fitness Studio",
        industry: "Health and Fitness",
        logo: "",
        logoPublicId: "",
        comment: "Placeholder comment: replace with your real client feedback.",
        author: "Head Coach",
      },
    ],
  },
  {
    id: 6,
    category: "UI / UX Design",
    title: "Travel Booking Redesign",
    description: "A fresh, faster booking experience for a travel agency.",
    image: "/images/projects/project-6.jpg",
    tech: ["Figma", "Design System"],
    year: "2025",
    duration: "2 months",
    demoUrl: "",
    features: [
      "User research and journey mapping",
      "New booking flow with fewer steps",
      "Reusable design system",
      "Mobile-first interactive prototype",
      "Usability testing with real customers",
    ],
    longDescription:
      "A travel agency's booking process was long and confusing, and many visitors left before finishing. We redesigned the experience from research to a tested prototype.\n\n## The challenge\n\nToo many steps, unclear pricing and a layout that was hard to use on phones.\n\n## Our solution\n\n- Research to find where visitors got stuck\n- A shorter booking flow with clear pricing\n- A design system the developers can reuse\n- Testing with real users before development\n\n## The result\n\nA clean, fast and confident booking journey, ready for development.",
    gallery: shots(6),
    clients: [
      {
        name: "Sample Travels",
        industry: "Travel and Tourism",
        logo: "",
        logoPublicId: "",
        comment: "Placeholder comment: replace with your real client feedback.",
        author: "Managing Director",
      },
    ],
  },
];

export const featuredProjects = projects.slice(0, 3);