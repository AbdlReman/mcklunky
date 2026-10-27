"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE_LOGO } from "@/lib/siteImages";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop?category=Burgers", label: "Burgers" },
  { href: "/shop?category=Sides", label: "Sides" },
  { href: "/shop", label: "Menu" },
  { href: "/shop?sale=true", label: "Deals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const activeCategory = searchParams.get("category") || "";
  const saleActive = searchParams.get("sale") === "true";

  useEffect(() => {
    const sync = () => {
      const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const count = items.reduce((sum: number, i: { quantity: number }) => sum + Number(i.quantity || 0), 0);
      setCartCount(count);
    };
    sync();
    window.addEventListener("cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isHome = pathname === "/";
  const isBurgers = pathname === "/shop" && activeCategory.toLowerCase() === "burgers";
  const isSides = pathname === "/shop" && activeCategory.toLowerCase() === "sides";
  const isMenu =
    pathname === "/shop" &&
    !saleActive &&
    activeCategory.toLowerCase() !== "burgers" &&
    activeCategory.toLowerCase() !== "sides";
  const isSale = pathname === "/shop" && saleActive;

  const linkClass = (active: boolean) =>
    `nav-link text-bone/80 hover:text-ember transition-colors ${active ? "text-ember border-b-2 border-ember" : ""}`;

  const isActiveLink = (label: string, href: string) => {
    if (label === "Home") return isHome;
    if (label === "Burgers") return isBurgers;
    if (label === "Sides") return isSides;
    if (label === "Menu") return isMenu;
    if (label === "Deals") return isSale;
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-smoke">
      <div className="bg-ember text-ink text-center py-2 text-[11px] font-bold tracking-[0.18em] uppercase">
        Free delivery across selected UK areas
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[4.25rem]">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={SITE_LOGO}
              alt="McKlunky"
              width={220}
              height={52}
              className="h-9 w-auto max-w-[min(12rem,48vw)] object-contain object-left"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(isActiveLink(link.label, link.href))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <div className="relative flex items-center">
              <button
                aria-label="Search"
                className="hover:text-ember transition-colors text-bone"
                onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>

              {searchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSearchOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-3 w-64 bg-charcoal shadow-xl ring-1 ring-smoke">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const q = searchQuery.trim();
                        setSearchOpen(false);
                        setSearchQuery("");
                        router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
                      }}
                      className="flex items-center gap-2 px-3 py-2.5"
                    >
                      <svg className="w-4 h-4 shrink-0 text-ash" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                      </svg>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search the menu..."
                        className="flex-1 bg-transparent text-sm text-bone placeholder:text-ash outline-none"
                      />
                    </form>
                  </div>
                </>
              )}
            </div>

            <Link href="/cart" aria-label="Cart" className="relative hover:text-ember transition-colors text-bone">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-ember text-ink text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden hover:text-ember transition-colors text-bone"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-smoke bg-ink">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link text-sm py-1 text-bone/90 hover:text-ember transition-colors ${
                  isActiveLink(link.label, link.href) ? "text-ember border-b-2 border-ember w-fit" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
