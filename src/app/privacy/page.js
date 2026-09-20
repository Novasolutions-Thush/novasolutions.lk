import LegalLayout from "@/components/sections/LegalLayout";
import { privacyContent } from "@/data/legal";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Nova Solutions collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return <LegalLayout content={privacyContent} />;
}