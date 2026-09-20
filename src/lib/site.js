export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const siteConfig = {
  name: "Nova Solutions",
  legalName: "Nova Solutions (Pvt) Ltd",
  alternateNames: ["Nova Solutions Sri Lanka", "Nova Solutions (Pvt) Ltd"],
  title: "Nova Solutions | Software Development Company in Sri Lanka",
  description:
    "Nova Solutions is a Sri Lankan software development company building modern websites, mobile apps, cloud solutions and custom software for growing businesses.",
  keywords: [
    "Nova Solutions",
    "software development company Sri Lanka",
    "web development Sri Lanka",
    "mobile app development",
    "custom software",
    "UI UX design",
    "cloud solutions",
  ],
  email: "hello@novasolutions.lk",
  // Add your real social profile URLs here. Google uses them to connect
  // your website with your brand.
  sameAs: [
    // "https://www.facebook.com/yourpage",
    // "https://www.linkedin.com/company/yourcompany",
  ],
};