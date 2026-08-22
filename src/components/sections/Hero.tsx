"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import HexButton from "@/components/ui/HexButton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { scrollToSection } from "@/lib/utils";

export default function Hero() {
  const { t } = useI18n();
  const { heroLogo, heroBackground } = useSiteData();

  return (
    <section id="home" className="relative isolate min-h-svh w-full overflow-hidden bg-night-deep">
      <motion.img
        src={heroBackground}
        alt=""
        aria-hidden="true"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1.09, x: ["-1%", "1%", "-1%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover opacity-90"
      />

      <div className="absolute inset-0">
        <AnimatedBackground />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="light-ray absolute -top-40 right-[8%] h-[150%] w-28 opacity-60" />
        <div
          className="light-ray absolute -top-40 right-[20%] h-[150%] w-16 opacity-45"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="light-ray absolute -top-40 right-[30%] h-[150%] w-10 opacity-30"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="haze absolute bottom-0 left-0 h-1/3 w-full"
          style={{ background: "linear-gradient(to top, rgba(160,175,205,0.16), transparent)" }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,8,26,0.86) 0%, rgba(4,8,26,0.35) 38%, rgba(4,8,26,0.8) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-4xl flex-col items-center justify-center px-4 pt-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <img
            src={heroLogo}
            alt="Eng/Nouran El-Masry"
            className="mx-auto h-48 w-auto sm:h-64 md:h-80"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          className="mt-8 max-w-3xl text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl md:mt-10 md:text-6xl"
        >
          {t.hero.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="mt-6 max-w-2xl text-base text-ink-muted md:text-lg"
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
        >
          <HexButton variant="solid" onClick={() => scrollToSection("contact")}>
            {t.hero.cta1}
          </HexButton>
          <HexButton onClick={() => scrollToSection("projects")}>{t.hero.cta2}</HexButton>
        </motion.div>

        <div className="mt-auto flex flex-col items-center gap-2 pb-10 pt-16">
          <span className="flex h-9 w-5.5 items-start justify-center rounded-full border border-ink-muted/60 pt-1.5">
            <span className="wheel-dot h-2 w-0.5 rounded-full bg-ink-muted" />
          </span>
        </div>
      </div>
    </section>
  );
}
