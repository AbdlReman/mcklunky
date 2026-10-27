"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error("Message not sent", { description: data.error || "Please try again." });
        return;
      }
      setSubmitted(true);
      toast.success("Message sent", { description: "We will get back to you soon." });
    } catch {
      toast.error("Network error", { description: "Could not reach the server. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ink text-bone">
      <section className="relative overflow-hidden py-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/patrick-tomasso-499112-unsplash.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-ink/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember mb-4">
            <Link href="/" className="hover:text-bone transition-colors">Home</Link>
            {" / "}Contact
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide leading-none text-bone">
            Get in
            <br />
            <span className="text-ember">touch</span>
          </h1>
        </div>
      </section>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember mb-4">Contact Info</p>
              <div className="space-y-6">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                    label: "Our Location",
                    value: "United Kingdom",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: "Email",
                    value: "hello@mcklunky.co.uk",
                    href: "mailto:hello@mcklunky.co.uk",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                      </svg>
                    ),
                    label: "Support",
                    value: "support@mcklunky.co.uk",
                    href: "mailto:support@mcklunky.co.uk",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    ),
                    label: "Website",
                    value: "mcklunky.co.uk",
                    href: "https://mcklunky.co.uk",
                  },
                ].map(({ icon, label, value, href }) => (
                  <div key={label} className="flex gap-4">
                    <div className="w-10 h-10 bg-ember text-ink rounded-full flex-shrink-0 flex items-center justify-center">
                      {icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ash mb-1">{label}</p>
                      <p className="text-sm whitespace-pre-line text-bone">
                        {href ? (
                          <a href={href} className="underline decoration-ember/50 hover:text-ember" target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember mb-4">Quick Answers</p>
              <div className="space-y-4">
                {[
                  { q: "How long does delivery take?", a: "Most UK orders arrive within 30–60 minutes depending on your area." },
                  { q: "Do you deliver nationwide?", a: "We deliver across selected areas of the United Kingdom. Check at checkout for availability." },
                  {
                    q: "Is the food made fresh?",
                    a: "Yes — McKlunky meals are prepared to order with quality ingredients.",
                  },
                ].map(({ q, a }) => (
                  <div key={q} className="border-l-2 border-ember pl-4">
                    <p className="font-bold text-sm mb-1 text-bone">{q}</p>
                    <p className="text-ash text-xs">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 border border-smoke bg-charcoal">
                <div className="w-20 h-20 bg-ember text-ink rounded-full flex items-center justify-center text-3xl mb-6">
                  ✓
                </div>
                <h2 className="font-display text-3xl tracking-wide mb-3 text-bone">Message sent!</h2>
                <p className="text-ash max-w-sm mb-8">
                  Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="btn-primary"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 bg-charcoal border border-smoke p-6 sm:p-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember mb-6">Send us a message</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] mb-2 text-ash">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full border border-smoke bg-ink text-bone px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors placeholder:text-ash/60"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.16em] mb-2 text-ash">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full border border-smoke bg-ink text-bone px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors placeholder:text-ash/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.16em] mb-2 text-ash">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-smoke bg-ink text-bone px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors"
                  >
                    <option value="">Select a subject…</option>
                    <option>Order & Delivery</option>
                    <option>Returns & Refunds</option>
                    <option>Menu Enquiry</option>
                    <option>Partnership Inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.16em] mb-2 text-ash">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help…"
                    className="w-full border border-smoke bg-ink text-bone px-4 py-3 text-sm focus:outline-none focus:border-ember transition-colors resize-none placeholder:text-ash/60"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
