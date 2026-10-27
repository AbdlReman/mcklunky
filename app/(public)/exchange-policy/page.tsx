import type { Metadata } from "next";
import LegalPage, { type PolicySection } from "../_components/LegalPage";

export const metadata: Metadata = {
  title: "Returns & Exchange Policy | McKlunky",
  description: "Review McKlunky returns eligibility, delivery issues, and food product terms.",
};

const sections: PolicySection[] = [
  {
    title: "1. Order Issues",
    paragraphs: ["Contact us within 24 hours of delivery if:"],
    items: [
      "The item received is significantly different from the product description",
      "The wrong item was delivered",
      "The order is incomplete or damaged on arrival",
    ],
  },
  {
    title: "2. Fresh Food Policy",
    paragraphs: [
      "Because McKlunky sells freshly prepared food, we generally cannot accept returns of opened or consumed items for hygiene reasons.",
    ],
    items: [
      "Approved issues may be resolved with a replacement order or store credit where appropriate",
      "Refunds may be offered at our discretion for confirmed fulfilment errors",
    ],
  },
  {
    title: "3. Delivery Costs",
    paragraphs: ["For approved replacements:"],
    items: [
      "We will arrange a replacement delivery where possible",
      "Customers should keep packaging and leftovers until the issue is reviewed",
      "We are not responsible for issues caused after successful delivery (e.g. improper storage)",
    ],
  },
  {
    title: "4. Product Availability",
    paragraphs: [
      "Menu items may sell out or change without notice.",
      "If an item is unavailable after you order, we will contact you with alternatives or adjust your order.",
    ],
  },
  {
    title: "5. Non-Eligible Situations",
    paragraphs: ["We may decline claims if:"],
    items: [
      "The issue was already clearly shown in the product description (e.g. spice level, allergens)",
      "The customer changes their mind after the order has been prepared",
      "The food was left unattended after delivery and spoiled",
    ],
  },
  {
    title: "6. Contact Us",
    paragraphs: [
      "For order-related inquiries, contact us at support@mcklunky.co.uk.",
    ],
  },
];

export default function ExchangePolicyPage() {
  return (
    <LegalPage
      title="Returns & Exchange Policy"
      eyebrow="Returns & Exchange Policy"
      lastUpdated="October 2026"
      intro={[
        "At McKlunky, we sell freshly prepared food. Because of food safety and hygiene rules, returns are limited. We will always help when something goes wrong with your order.",
        "By placing an order, you agree to the terms below.",
      ]}
      sections={sections}
    />
  );
}
