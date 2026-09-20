export default function manifest() {
  return {
    name: "Nova Solutions",
    short_name: "Nova",
    description: "Modern web, mobile and cloud solutions.",
    start_url: "/",
    display: "standalone",
    background_color: "#edf2f4",
    theme_color: "#231942",
    icons: [{ src: "/logo.png", sizes: "512x512", type: "image/png" }],
  };
}