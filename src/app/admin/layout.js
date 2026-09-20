import AdminGuard from "@/components/layout/AdminGuard";
import AdminShell from "@/components/layout/AdminShell";

export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}