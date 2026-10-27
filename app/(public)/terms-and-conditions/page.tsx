import type { Metadata } from "next";
import LegalPage, { type PolicySection } from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | McKlunky",
  description: "Read McKlunky terms for orders, delivery, returns, food products, and website use.",
};

const sections: PolicySection[] = [
  {
    title: "1. About McKlunky",
    paragraphs: [
      "McKlunky is a UK food brand operating online at mcklunky.co.uk. We specialise in bold burgers, sides, combos, and related menu items.",
      "We are an independent food brand based in the United Kingdom.",
      "All trademarks, logos, and brand names displayed on our platform belong to their respective owners where applicable.",
    ],
  },
  {
    title: "2. Menu & Product Information",
    paragraphs: [
      "We aim to provide accurate product descriptions, images, and allergen information for every item listed.",
      "Food appearance may vary slightly due to preparation, photography, or screen settings.",
      "Customers with allergies should review product details carefully and contact us before ordering if unsure.",
    ],
  },
  {
    title: "3. Orders & Acceptance",
    paragraphs: [
      "Once an order is placed and confirmed, preparation may begin immediately.",
      "In certain situations, we may contact customers regarding product availability, order verification, delivery issues, or unexpected circumstances affecting the order.",
      "We reserve the right to cancel or refuse orders when necessary.",
    ],
  },
  {
    title: "4. Pricing",
    paragraphs: ["All prices displayed on the website are listed in GBP (£).", "McKlunky reserves the right to:"],
    items: [
      "Update product prices at any time",
      "Correct pricing errors",
      "Cancel orders affected by incorrect pricing or technical issues",
    ],
  },
  {
    title: "5. Delivery",
    paragraphs: [
      "We offer delivery across selected areas of the United Kingdom.",
      "Estimated delivery times are shown at checkout and may vary due to traffic, weather, public holidays, or operational issues beyond our control.",
      "Free delivery may apply on selected orders or areas as advertised.",
    ],
  },
  {
    title: "6. Customer Responsibility",
    paragraphs: ["Customers are responsible for carefully reviewing:"],
    items: [
      "Product descriptions and allergens",
      "Selected options before confirming purchase",
      "Delivery address and contact details",
      "Being available to receive the order",
    ],
  },
  {
    title: "7. Returns & Exchanges",
    paragraphs: [
      "Because we sell freshly prepared food, returns are limited for hygiene reasons.",
      "Please refer to our Returns & Exchange Policy page for detailed information regarding eligibility.",
    ],
  },
  {
    title: "8. Intellectual Property",
    paragraphs: [
      "All website content including images, text, graphics, branding, and layouts is the property of McKlunky unless otherwise stated.",
      "Users may not copy website content, reuse product photos, reproduce branding materials, or misuse the website or its content without permission.",
    ],
  },
  {
    title: "9. Limitation of Liability",
    paragraphs: ["McKlunky is not responsible for:"],
    items: [
      "Indirect or incidental damages",
      "Delays caused by delivery partners or traffic",
      "Customer allergen mistakes when information was disclosed",
      "Issues arising after successful delivery and acceptance",
    ],
  },
  {
    title: "10. Changes to Terms",
    paragraphs: [
      "We reserve the right to update or modify these Terms of Service at any time without prior notice.",
      "Continued use of the website after changes indicates acceptance of updated terms.",
    ],
  },
  {
    title: "11. Governing Law",
    paragraphs: ["These Terms of Service shall be governed and interpreted under the laws of England and Wales."],
  },
  {
    title: "12. Contact Us",
    paragraphs: [
      "For any questions regarding these Terms of Service, contact us at support@mcklunky.co.uk.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      eyebrow="Terms & Conditions"
      lastUpdated="October 2026"
      intro={[
        "Welcome to McKlunky. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service.",
        "Please read these terms carefully before placing an order.",
      ]}
      sections={sections}
    />
  );
}
