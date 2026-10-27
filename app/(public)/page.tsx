import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatGbp } from "@/lib/formatCurrency";
import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import { IMG } from "@/lib/siteImages";
import Product from "@/models/Product";
import type { IProduct } from "@/types/product";

export const metadata: Metadata = {
  title: "McKlunky | Bold British Food Delivered Across the UK",
  description:
    "McKlunky — bold British comfort food. Fresh burgers, crispy sides & loaded combos delivered across the United Kingdom. Order online at mcklunky.co.uk.",
  keywords: [
    "McKlunky",
    "UK burger delivery",
    "British comfort food",
    "order burgers online UK",
    "food delivery UK",
    "McKlunky menu",
    "takeaway burgers",
    "sides and combos UK",
  ],
  alternates: { canonical: "https://mcklunky.co.uk" },
  openGraph: {
    title: "McKlunky | Bold British Food Delivered Across the UK",
    description:
      "Bold British comfort food — burgers, sides & combos delivered across the UK.",
    url: "https://mcklunky.co.uk",
    images: [{ url: IMG.hero, width: 1200, height: 630, alt: "McKlunky — Bold British Food" }],
  },
};

const categories = [
  {
    name: "Burgers",
    desc: "Stacked, messy & unforgettable",
    image: IMG.burgers,
  },
  {
    name: "Sides",
    desc: "Crispy bites worth sharing",
    image: IMG.sides,
  },
  {
    name: "Combos",
    desc: "Meals made for proper hunger",
    image: IMG.combos,
  },
];

export const dynamic = "force-dynamic";

function featuredCardData(product: IProduct, index: number) {
  const hasDiscount = product.onSale || Number(product.discount || 0) > 0;
  const fallbacks = [IMG.hero, IMG.combos, IMG.burgers, IMG.chicken];
  return {
    id: product._id,
    name: product.name,
    price: product.price,
    originalPrice: product.regularPrice || product.price,
    brand: product.brand || "McKlunky",
    color: product.colors?.[0] || "Menu favourite",
    image: product.images?.[0] || fallbacks[index % fallbacks.length],
    slug: product.slug,
    hasDiscount,
  };
}

export default async function HomePage() {
  await connectDB();
  const featuredQuery = {
    status: "publish",
    $or: [{ tags: "featured" }, { tags: "Featured" }],
  };
  let rawFeatured = await Product.find(featuredQuery)
    .populate("category", "name slug")
    .sort({ order: 1, createdAt: -1 })
    .limit(4)
    .lean();
  if (rawFeatured.length === 0) {
    rawFeatured = await Product.find({ status: "publish" })
      .populate("category", "name slug")
      .sort({ order: 1, createdAt: -1 })
      .limit(4)
      .lean();
  }
  const featuredProducts = (rawFeatured as Record<string, unknown>[])
    .map((p) => serializeProductFromLean(p))
    .map((p, idx) => featuredCardData(p, idx));

  return (
    <div className="bg-ink text-bone">
      {/* Hero — full-bleed food plane */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden grain-overlay">
        <div className="absolute inset-0">
          <Image
            src={IMG.hero}
            alt="McKlunky signature burger"
            fill
            priority
            className="object-cover object-center animate-slow-zoom"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ember/20 to-transparent animate-ember" />
        </div>

        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32 md:pb-24">
          <p className="font-display text-ember text-2xl md:text-3xl tracking-[0.2em] mb-3 animate-fade-in-up">
            McKlunky
          </p>
          <h1 className="hero-text text-bone max-w-4xl mb-5 animate-fade-in-up" style={{ animationDelay: "80ms" }}>
            Food worth
            <br />
            being loud about
          </h1>
          <p className="text-bone/85 text-base md:text-lg max-w-md mb-9 leading-relaxed animate-fade-in-up" style={{ animationDelay: "140ms" }}>
            Bold British burgers, crispy sides & loaded combos — delivered across the UK.
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Link href="/shop?category=Burgers" className="btn-primary">
              Order burgers
            </Link>
            <Link href="/shop" className="btn-outline">
              Full menu
            </Link>
          </div>
        </div>
      </section>

      {/* Categories with food photography */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ember mb-3">The menu</p>
        <h2 className="font-display text-4xl md:text-5xl text-bone mb-10 tracking-wide">Pick your hunger</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-[22rem] overflow-hidden"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ember mb-2">{cat.desc}</p>
                <h3 className="font-display text-4xl text-bone tracking-wide">{cat.name}</h3>
                <span className="mt-4 inline-flex text-[11px] font-bold uppercase tracking-[0.16em] text-bone/80 group-hover:text-ember transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section-light py-16 md:py-20">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ember-deep mb-2">Crowd favourites</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink tracking-wide">Featured menu</h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70 hover:text-ember-deep transition-colors"
            >
              View all →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/shop/${product.slug}`} className="product-card group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-smoke mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover product-img"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <span className="absolute top-3 left-3 z-10 bg-ink text-ember text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      {product.brand}
                    </span>
                    {product.hasDiscount ? (
                      <span className="absolute top-3 right-3 z-10 bg-ember text-ink text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                        Sale
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wide text-ink mb-1">{product.name}</h3>
                  <p className="text-ash text-xs mb-2">{product.color}</p>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-lg text-ink">{formatGbp(product.price)}</span>
                    {product.hasDiscount ? (
                      <>
                        <span className="text-ash/80 line-through text-sm">{formatGbp(product.originalPrice)}</span>
                        <span className="text-ember-deep text-xs font-bold">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      </>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Bacon Stack Burger", price: 12.5, image: IMG.hero },
                { name: "Classic Smash", price: 9.5, image: IMG.combos },
                { name: "Loaded Fries", price: 5.5, image: IMG.sides },
                { name: "Roast Chicken Plate", price: 11.0, image: IMG.chicken },
              ].map((item) => (
                <Link key={item.name} href="/shop" className="product-card group block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-smoke mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover product-img"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-wide text-ink mb-1">{item.name}</h3>
                  <p className="text-ash text-xs mb-2">Coming to the menu</p>
                  <span className="font-black text-lg text-ink">{formatGbp(item.price)}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link href="/shop" className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70">
              View all →
            </Link>
          </div>
        </div>
      </section>

      {/* Mid banner */}
      <section className="relative min-h-[52vh] flex items-center overflow-hidden">
        <Image
          src={IMG.chicken}
          alt="McKlunky roast plate"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-bone tracking-wide mb-5">
            Big flavour. Zero apologies.
          </h2>
          <p className="text-bone/80 mb-9 max-w-lg mx-auto">
            Limited deals on burgers, sides & combos — free delivery on selected UK orders.
          </p>
          <Link href="/shop?sale=true" className="btn-primary">
            Shop the deals
          </Link>
        </div>
      </section>

      {/* Why McKlunky */}
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] md:aspect-[5/4] overflow-hidden">
            <Image
              src={IMG.kitchen}
              alt="McKlunky kitchen prep"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-ember/20" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-ember mb-3">Why McKlunky</p>
            <h2 className="font-display text-4xl md:text-5xl text-bone tracking-wide mb-8">The difference</h2>
            <ul className="space-y-8">
              {[
                { title: "Bold flavour", desc: "Recipes built for big taste — never bland, never boring." },
                { title: "Fresh daily", desc: "Made to order with quality ingredients you can taste." },
                { title: "UK delivery", desc: "Order online and get your McKlunky fix delivered across the UK." },
              ].map((item, i) => (
                <li key={item.title} className="flex gap-5">
                  <span className="font-display text-3xl text-ember leading-none w-10 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl text-bone tracking-wide mb-1">{item.title}</h3>
                    <p className="text-ash text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-outline mt-10 inline-block">
              Our story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
