import Link from "next/link";

export type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type LegalPageProps = {
  title: string;
  eyebrow: string;
  lastUpdated: string;
  intro: string[];
  sections: PolicySection[];
};

export default function LegalPage({
  title,
  eyebrow,
  lastUpdated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="bg-ink text-bone">
      <section className="bg-charcoal border-b border-smoke py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember mb-4">
            <Link href="/" className="hover:text-bone transition-colors">
              Home
            </Link>
            {" / "}
            {eyebrow}
          </p>
          <h1 className="font-display text-5xl md:text-7xl tracking-wide leading-none text-bone">
            {title}
          </h1>
          <p className="text-ash text-sm mt-6">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="space-y-5 text-ash leading-relaxed mb-12">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-smoke pt-8">
              <h2 className="font-display text-2xl tracking-wide text-ember mb-4">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-ash leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
              {section.items ? (
                <ul className="list-disc pl-5 space-y-2 text-ash">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
