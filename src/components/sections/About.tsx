"use client";

import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";

export default function About() {
  const { t } = useI18n();
  const { aboutBackground, profile } = useSiteData();

  const statsData = [
    { value: t.about.stats.values.experience, label: t.about.stats.experience },
    { value: t.about.stats.values.projects, label: t.about.stats.projects },
    { value: t.about.stats.values.clients, label: t.about.stats.clients },
    { value: t.about.stats.values.commitment, label: t.about.stats.commitment },
  ];

  return (
    <section id="about" className="relative -mt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-white/5 bg-night-panel">
        <img
          src={aboutBackground}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="light-ray absolute -top-32 right-[26%] h-[140%] w-24 opacity-50" />
          <div
            className="light-ray absolute -top-32 right-[38%] h-[140%] w-12 opacity-35"
            style={{ animationDelay: "-4s" }}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,17,48,0.75), rgba(7,12,32,0.94))",
          }}
        />

        <div className="relative z-10 px-6 py-16 sm:px-10 md:px-14 md:py-24">
          <SectionHeading overline="ABOUT" title={t.about.title} />

          <div className="mt-12 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16">
            <div className="space-y-5 text-[17px] leading-relaxed text-ink-muted">
              <p>{t.about.bio}</p>
              <p>{t.about.bioExtra}</p>
              <p className="text-ink">{t.about.bioFinal}</p>
            </div>

            <dl className="grid grid-cols-2 gap-6 self-start border-t border-white/5 pt-8 md:border-s md:border-t-0 md:ps-10 md:pt-0">
              {statsData.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-latin text-3xl font-semibold text-glow">{stat.value}</dt>
                  <dd className="mt-1 text-sm text-ink-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
