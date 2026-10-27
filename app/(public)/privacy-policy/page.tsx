import type { Metadata } from "next";
import LegalPage, { type PolicySection } from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | McKlunky",
  description: "Learn how McKlunky collects, uses, and protects customer information.",
};

const sections: PolicySection[] = [
  {
    title: "1. Information We Collect",
    paragraphs: ["When you use our website, we may collect the following information:"],
    items: [
      "Name",
      "Email address",
      "Phone number",
      "Delivery and billing address",
      "Payment-related information",
      "Order history",
      "Messages or inquiries sent to us",
    ],
  },
  {
    title: "Non-Personal Information",
    paragraphs: ["We may also collect non-personal information such as:"],
    items: ["Browser type", "Device information", "IP address", "Website usage data"],
  },
  {
    title: "2. How We Use Your Information",
    paragraphs: ["We use your information to:"],
    items: [
      "Process and deliver orders",
      "Provide customer support",
      "Improve our website and services",
      "Send order updates and important notifications",
      "Prevent fraudulent activity",
      "Communicate promotional offers or updates, if applicable",
    ],
  },
  {
    title: "3. Product Information",
    paragraphs: [
      "McKlunky is a UK food brand that sells burgers, sides, combos, and related menu items online.",
      "We aim to provide accurate product descriptions and images. Ingredients and allergen details are shown where available.",
    ],
  },
  {
    title: "4. Payment Security",
    paragraphs: [
      "We do not store sensitive payment information on our servers.",
      "All payments are processed through secure payment providers to help protect your information.",
    ],
  },
  {
    title: "5. Sharing of Information",
    paragraphs: ["We do not sell, rent, or trade your personal information to third parties."],
    items: [
      "Delivery partners",
      "Payment service providers",
      "Legal authorities if required by law",
    ],
  },
  {
    title: "6. Cookies & Analytics",
    paragraphs: [
      "Our website may use cookies or similar technologies to improve user experience and analyze website traffic.",
      "You can disable cookies through your browser settings if preferred.",
    ],
  },
  {
    title: "7. Data Protection",
    paragraphs: [
      "We take reasonable measures to protect your personal information from unauthorized access, misuse, or disclosure, in line with UK GDPR principles.",
      "However, no online platform can guarantee complete security.",
    ],
  },
  {
    title: "8. Third-Party Links",
    paragraphs: [
      "Our website may contain links to third-party websites or social media platforms. We are not responsible for the privacy practices of those websites.",
    ],
  },
  {
    title: "9. Your Rights",
    paragraphs: ["Under UK data protection law, you may request to:"],
    items: [
      "Access your personal information",
      "Correct inaccurate information",
      "Delete your information, where applicable",
      "Contact us directly for privacy-related requests",
    ],
  },
  {
    title: "10. Contact Us",
    paragraphs: [
      "If you have any questions regarding this Privacy Policy, contact us at support@mcklunky.co.uk.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      eyebrow="Privacy Policy"
      lastUpdated="October 2026"
      intro={[
        "Welcome to McKlunky. Your privacy is important to us, and we are committed to protecting your personal information when you use our website and services.",
        "By accessing or using our website, you agree to the terms outlined in this Privacy Policy.",
      ]}
      sections={sections}
    />
  );
}
