"use client";

import {
  WindIcon,
  DropletsIcon,
  ZapIcon,
  FlameIcon,
  BoxesIcon,
  GaugeIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";

const icons = {
  wind: WindIcon,
  droplets: DropletsIcon,
  zap: ZapIcon,
  flame: FlameIcon,
  boxes: BoxesIcon,
  gauge: GaugeIcon,
};

export default function Specialties() {
  const { locale, t } = useI18n();
  const { specialties } = useSiteData();

  return (
    <section id="expertise" className="px-4 py-24 sm:px-6 md:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading overline="EXPERTISE" title={t.expertise.title} />

        <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {specialties.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.title} className="group flex gap-4">
                <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-glow/10 ring-1 ring-glow/25 transition-colors duration-150 ease-out group-hover:bg-glow/20">
                  <Icon className="h-[18px] w-[18px] text-glow" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-ink">
                    {locale === "ar" ? item.titleAr : item.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                    {locale === "ar" ? item.descriptionAr : item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
