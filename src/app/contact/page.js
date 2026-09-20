import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/sections/ContactForm";
import ContactInfo from "@/components/sections/ContactInfo";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Nova Solutions to discuss your next web, mobile or cloud project.",
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Share a few details and our team will get back to you within one business day."
      />

      <section className="pb-10 pt-6 sm:pb-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <ContactInfo />
          </Reveal>
        </div>
      </section>
    </main>
  );
}