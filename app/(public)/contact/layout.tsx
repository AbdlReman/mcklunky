import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | McKlunky UK Food Brand",
  description:
    "Get in touch with McKlunky — UK food brand for bold burgers, sides & combos. Email or contact form at mcklunky.co.uk.",
  alternates: { canonical: "https://mcklunky.co.uk/contact" },
  openGraph: {
    title: "Contact McKlunky | UK Food Brand",
    description:
      "Reach us by email or contact form. Bold British food delivered across the UK.",
    url: "https://mcklunky.co.uk/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
