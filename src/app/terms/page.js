import LegalLayout from "@/components/sections/LegalLayout";
import { termsContent } from "@/data/legal";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you use the Nova Solutions website and services.",
};

export default function TermsPage() {
  return <LegalLayout content={termsContent} />;
}