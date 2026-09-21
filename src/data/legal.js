export const privacyContent = {
  eyebrow: "Privacy Policy",
  title: "Your privacy matters to us",
  description:
    "How {company} collects, uses and protects your personal information when you use our website.",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      paragraphs: [
        "{company} (\"we\", \"our\", \"us\") respects your privacy. This Privacy Policy explains what personal information we collect through the novasolutions.lk website, why we collect it, how we use it and what choices you have.",
        "By using this website you confirm that you have read this policy. If you do not agree with it, please do not submit personal information through the website.",
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      paragraphs: ["We collect only the information needed to run the website and respond to you:"],
      items: [
        "Contact form details: your name, email address, phone number (optional), the service you are interested in and the message you write.",
        "Technical data: our hosting and security providers may automatically process basic technical information such as IP address, browser type and request time to deliver the website and prevent abuse.",
        "Browser storage: your light or dark theme choice and a temporary copy of our site settings, saved on your own device.",
        "Admin accounts: authorised staff sign in with an email address and password, which are handled by Firebase Authentication.",
      ],
      after: [
        "We do not collect payment card details through this website, and we do not ask for sensitive personal data.",
      ],
    },
    {
      id: "how-we-use-information",
      title: "How We Use Your Information",
      paragraphs: ["We use the information you provide to:"],
      items: [
        "Reply to your enquiry and prepare proposals or quotations.",
        "Communicate with you about a project you have asked us about.",
        "Protect the website against spam, fraud and other misuse.",
        "Improve the content and usability of the website.",
        "Meet our legal and regulatory obligations.",
      ],
      after: ["We do not use your information for automated decision-making, and we do not sell it."],
    },
    {
      id: "cookies-and-storage",
      title: "Cookies and Local Storage",
      paragraphs: [
        "We do not use advertising or tracking cookies. The website stores a small amount of data in your browser (local storage) to remember your theme preference and to load site details faster. Signed-in administrators also have a session stored by Firebase Authentication.",
        "You can clear this data at any time from your browser settings. If we add analytics or other tracking tools in the future, we will update this policy and, where required, ask for your consent first.",
      ],
    },
    {
      id: "third-party-services",
      title: "Third-Party Services",
      paragraphs: ["We rely on trusted providers to operate the website. They process data only to provide their services:"],
      items: [
        "Google Firebase (Firestore and Authentication): stores contact messages, site settings and administrator accounts.",
        "Cloudinary: stores and delivers project images shown on the website.",
        "Our website hosting provider: serves the website and may keep standard server logs.",
        "Google reCAPTCHA and Firebase App Check: help us tell real visitors from automated bots. Google may process technical data such as your IP address for this purpose, under Google's own privacy policy.",
      ],
      after: [
        "Some of these providers process data on servers outside Sri Lanka. Links on our website to social media or other sites lead to services with their own privacy policies, which we do not control.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing of Information",
      paragraphs: ["We do not sell or rent your personal information. We share it only:"],
      items: [
        "With the service providers listed above, to operate the website.",
        "When required by law, a court order or a lawful request from a public authority.",
        "To protect our rights, property or safety, or those of our clients and users.",
        "As part of a merger, acquisition or sale of the business, in which case the same protections will continue to apply.",
      ],
    },
    {
      id: "retention",
      title: "How Long We Keep Your Information",
      paragraphs: [
        "We keep contact messages for as long as needed to handle your enquiry and any resulting project. Enquiries that do not lead to a project are generally deleted within 24 months. Information connected to a contract is kept for the period required by law and for our legitimate business records.",
      ],
    },
    {
      id: "your-rights",
      title: "Your Rights",
      paragraphs: [
        "Under the Personal Data Protection Act, No. 9 of 2022 of Sri Lanka and other applicable law, you may have the right to:",
      ],
      items: [
        "Ask what personal information we hold about you and request a copy.",
        "Ask us to correct information that is inaccurate or incomplete.",
        "Ask us to delete your information, where we no longer need it.",
        "Withdraw your consent, or object to certain uses of your information.",
      ],
      after: [
        "To use any of these rights, email us at {email}. We may need to confirm your identity first, and we will reply within a reasonable time.",
      ],
    },
    {
      id: "security",
      title: "Security of Your Information",
      paragraphs: [
        "We use reasonable technical and organisational measures to protect your information, including encrypted connections, restricted admin access and access rules on our database. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. You can read more on our Security page.",
      ],
    },
    {
      id: "children",
      title: "Children's Privacy",
      paragraphs: [
        "Our website is intended for businesses and adults. We do not knowingly collect personal information from children. If you believe a child has sent us information, please contact us and we will delete it.",
      ],
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top of this page shows when it was last changed. Continued use of the website after an update means you accept the revised policy.",
      ],
    },
  ],
};

export const termsContent = {
  eyebrow: "Terms of Service",
  title: "Terms of Service",
  description:
    "The rules that apply when you use the {company} website and contact us about our services.",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      paragraphs: [
        "By accessing or using the novasolutions.lk website, you agree to these Terms of Service and to our Privacy Policy. If you do not agree, please stop using the website.",
      ],
    },
    {
      id: "our-services",
      title: "About Our Services",
      paragraphs: [
        "This website provides information about the software development services offered by {company}. The descriptions of services and projects on the website are for general information only.",
        "Any actual project work is governed by a separate written proposal or agreement between you and {company}. If there is a conflict between these Terms and that agreement, the agreement prevails for that project.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable Use",
      paragraphs: ["When using the website you agree not to:"],
      items: [
        "Break any law or infringe the rights of others.",
        "Try to gain unauthorised access to the website, its administration area, servers or data.",
        "Introduce malware, or interfere with or overload the website.",
        "Use bots, scrapers or automated tools in a way that harms the website or its performance.",
        "Send spam, false or misleading information through the contact form.",
        "Copy or resell any part of the website without our written permission.",
      ],
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      paragraphs: [
        "The website design, text, graphics, logo, code and other content are owned by or licensed to {company} and are protected by intellectual property laws. You may view and share links to the website for personal or business evaluation, but you may not copy, modify or distribute its content without our prior written consent.",
        "Projects shown in our portfolio may belong to our clients and are displayed with their permission. Ownership of work delivered to a client is set out in the agreement for that project.",
      ],
    },
    {
      id: "enquiries-and-quotes",
      title: "Enquiries and Quotations",
      paragraphs: [
        "Sending a message through the contact form does not create a contract. A contract is formed only when both parties agree in writing to a proposal or agreement. Estimates and quotations are valid for the period stated in them.",
      ],
    },
    {
      id: "third-party-links",
      title: "Third-Party Links",
      paragraphs: [
        "The website may link to third-party websites such as social media platforms. We do not control these sites and are not responsible for their content, policies or practices.",
      ],
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      paragraphs: [
        "The website and its content are provided \"as is\" and \"as available\". We work to keep the information accurate and the website available, but we do not guarantee that it will be error-free, uninterrupted or always up to date.",
      ],
    },
    {
      id: "limitation-of-liability",
      title: "Limitation of Liability",
      paragraphs: [
        "To the fullest extent permitted by law, {company} is not liable for any indirect, incidental or consequential loss arising from your use of, or inability to use, the website. Nothing in these Terms excludes liability that cannot be excluded under applicable law.",
      ],
    },
    {
      id: "privacy-and-security",
      title: "Privacy and Security",
      paragraphs: [
        "How we handle personal information is explained in our Privacy Policy. Our security practices and how to report a vulnerability are described on our Security page.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      paragraphs: [
        "We may update these Terms from time to time. The \"Last updated\" date shows the latest version. Continued use of the website after a change means you accept the updated Terms.",
      ],
    },
    {
      id: "governing-law",
      title: "Governing Law",
      paragraphs: [
        "These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka. Any dispute will be subject to the jurisdiction of the courts of Sri Lanka.",
      ],
    },
  ],
};

export const securityContent = {
  eyebrow: "Security",
  title: "Security at {company}",
  description:
    "How we protect this website and your information, and how you can report a security concern.",
  sections: [
    {
      id: "our-commitment",
      title: "Our Commitment",
      paragraphs: [
        "We build software for a living, so we treat the security of our own website seriously. This page explains the main protections we use and how you can help us keep the website safe.",
      ],
    },
    {
      id: "how-we-protect",
      title: "How We Protect the Website",
      paragraphs: ["Our website is built with the following safeguards:"],
      items: [
        "Encrypted connections (HTTPS) protect data sent between your browser and the website.",
        "The administration area is restricted to authorised staff and requires a signed-in, approved account. Public self-registration is disabled.",
        "Database access rules ensure that only administrators can read contact messages or change website content.",
        "Contact form entries are validated for type and length, and hidden spam traps help block automated submissions.",
        "Image uploads use short-lived signatures created on our server, and the server confirms the user is an administrator before allowing an upload.",
        "Secret keys are stored on the server and are never included in the code sent to your browser.",
      ],
    },
    {
      id: "data-storage",
      title: "Where Your Data Is Stored",
      paragraphs: [
        "Contact messages and site settings are stored in Google Firebase (Firestore). Project images are stored with Cloudinary. Both are established providers with their own security programmes. Access to our accounts with these providers is limited to authorised staff.",
      ],
    },
    {
      id: "your-part",
      title: "What You Can Do",
      paragraphs: ["You can help keep your information safe by following these tips:"],
      items: [
        "Never send passwords, payment card numbers or other highly sensitive data through the contact form or by ordinary email.",
        "Check that the address in your browser is novasolutions.lk before entering any information.",
        "Be careful with emails claiming to be from us that ask for money or login details. If in doubt, contact us using the details on this website.",
      ],
    },
    {
      id: "report-a-vulnerability",
      title: "Reporting a Vulnerability",
      paragraphs: [
        "If you believe you have found a security issue on this website, please email {email} with the subject \"Security Report\". Include the page or URL affected, the steps to reproduce the issue and, if possible, screenshots.",
        "To help us fix it safely, please:",
      ],
      items: [
        "Give us a reasonable time to investigate and fix the issue before sharing it publicly.",
        "Do not access, change or delete data that does not belong to you.",
        "Do not disrupt the website, for example with denial-of-service tests or spam.",
        "Do not use social engineering against our staff or clients.",
      ],
      after: [
        "We appreciate good-faith research that follows these guidelines. We will acknowledge your report within a reasonable time and keep you updated on the outcome.",
      ],
    },
    {
      id: "incident-response",
      title: "If Something Goes Wrong",
      paragraphs: [
        "If a security incident affects personal information, we will investigate promptly, take steps to contain it and notify affected people and the relevant authorities where the law requires us to do so.",
      ],
    },
    {
      id: "updates",
      title: "Keeping This Page Current",
      paragraphs: [
        "Security practices change over time. We will update this page when our safeguards change in a meaningful way. The \"Last updated\" date shows the latest revision.",
      ],
    },
  ],
};