"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SiteShell({ children }) {
  const pathname = usePathname();

  // Admin panel has its own layout
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary-dark focus:px-5 focus:py-3 focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <div id="main-content" tabIndex={-1} className="min-h-screen outline-none">
        {children}
      </div>
      <Footer />
    </>
  );
}