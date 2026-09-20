import LegalLayout from "@/components/sections/LegalLayout";
import { securityContent } from "@/data/legal";

export const metadata = {
  title: "Security",
  description:
    "How Nova Solutions protects its website and your information, and how to report a vulnerability.",
};

export default function SecurityPage() {
  return <LegalLayout content={securityContent} />;
}