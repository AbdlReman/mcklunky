import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IMG } from "@/lib/siteImages";

export const metadata: Metadata = {
  title: "About Us | Bold British Food Brand",
  description:
    "McKlunky is a UK food brand built on bold flavour — burgers, sides & combos made for proper hunger. Learn our story at mcklunky.co.uk.",
  alternates: { canonical: "https://mcklunky.co.uk/about" },
  openGraph: {
    title: "About McKlunky | Bold British Food",
    description:
      "Learn about McKlunky — a UK food brand serving bold burgers, sides & combos.",
    url: "https://mcklunky.co.uk/about",
    images: [{ url: IMG.kitchen, width: 1200, height: 630, alt: "McKlunky kitchen" }],
  },
};

export default function AboutPage() {
  return (
    <div className="bg-ink text-bone">
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <Image
          src={IMG.burgers}
          alt="McKlunky feast"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember mb-4">
            <Link href="/" className="hover:text-bone transition-colors">Home</Link>
            {" / "}About
          </p>
          <h1 className="hero-text text-bone max-w-3xl mb-4">
            Our story
          </h1>
          <p className="text-bone/80 text-lg max-w-xl leading-relaxed">
            British food should be loud, honest, and unforgettable.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-5 text-ash text-lg leading-relaxed">
            <p className="text-bone text-xl">
              McKlunky started with a simple idea: bold flavour for proper hunger.
            </p>
            <p>
              We build bold burgers, crispy sides, and loaded combos for people who want taste without the faff —
              made to order and delivered across the UK.
            </p>
            <p>Every item on the menu is crafted for big taste and everyday cravings.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["BOLD", "BRITISH FLAVOUR"],
              ["FRESH", "EVERY ORDER"],
              ["UK-WIDE", "DELIVERY"],
              ["NEW DROPS", "ON THE MENU"],
            ].map(([num, label]) => (
              <div key={label} className="border border-smoke bg-charcoal p-6">
                <p className="font-display text-2xl md:text-3xl text-ember mb-2 tracking-wide">{num}</p>
                <p className="text-ash text-[11px] uppercase tracking-[0.16em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] overflow-hidden order-2 lg:order-1">
              <Image
                src={IMG.kitchen}
                alt="Preparing McKlunky food"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ember-deep mb-3">Our mission</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink tracking-wide mb-6">
                Flavour for everyone
              </h2>
              <p className="text-ink/70 leading-relaxed mb-6">
                We believe great food should hit hard and feel familiar. Our mission is to bring bold British comfort
                food to hungry people across the UK — no fluff, just proper plates.
              </p>
              <div className="space-y-6 mb-10">
                {[
                  {
                    title: "Flavour first",
                    desc: "Every recipe is built for big taste — seasoned, stacked, and worth the hype.",
                  },
                  {
                    title: "Made fresh",
                    desc: "Quality ingredients and made-to-order prep so every bite lands right.",
                  },
                  {
                    title: "UK community",
                    desc: "Built for British food lovers. New menu drops and deals added regularly.",
                  },
                ].map(({ title, desc }, i) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-9 h-9 bg-ink text-ember flex-shrink-0 flex items-center justify-center font-display text-lg">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-ink tracking-wide mb-1">{title}</h3>
                      <p className="text-ink/60 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-ink text-ember px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-ember hover:text-ink transition-colors"
              >
                Explore the menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 text-center overflow-hidden">
        <Image src={IMG.bbq} alt="" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative z-10 px-4">
          <h2 className="font-display text-4xl md:text-6xl text-bone tracking-wide mb-5">
            Hungry yet?
          </h2>
          <p className="text-ash mb-10 max-w-md mx-auto">
            Browse the latest McKlunky burgers, sides & combos.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/shop" className="btn-primary">
              Order now
            </Link>
            <Link href="/contact" className="btn-outline">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
