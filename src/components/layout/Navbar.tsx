"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/i18n/provider";
import { scrollToSection } from "@/lib/utils";
import { MenuIcon, XIcon } from "lucide-react";

const navItems = ["home", "about", "expertise", "projects", "experience", "cv", "contact"] as const;

export default function Navbar() {
  const { locale, t, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.05, 0.25, 0.5] }
    );

    navItems.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNav = (id: string) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-200 ease-out ${
        scrolled
          ? "border-b border-white/5 bg-night-deep/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-17 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="font-latin shrink-0 text-sm tracking-[0.18em] text-ink-muted md:hidden">
          N. EL-MASRY
        </span>

        <nav className="hidden items-center justify-center gap-8 md:flex md:flex-1">
          {navItems.map((id) => {
            const label = t.nav[id];
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleNav(id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative whitespace-nowrap pb-2 text-sm transition-colors duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-glow/60 ${
                  isActive ? "font-semibold text-glow-strong" : "text-ink-muted hover:text-ink"
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-glow shadow-glow transition-opacity duration-150 ease-out ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <button
            onClick={toggleLocale}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium tracking-widest text-ink-muted transition-all duration-150 hover:border-glow/30 hover:text-glow"
          >
            {locale === "en" ? "AR" : "EN"}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="قائمة التنقل"
            className="rounded-md p-2 text-ink transition-colors duration-150 ease-out hover:text-glow md:hidden"
          >
            {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/5 bg-night-deep/95 px-4 py-3 md:hidden">
          {navItems.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleNav(id)}
              className={`block w-full py-3 text-sm transition-colors duration-150 ease-out ${
                active === id ? "text-glow-strong" : "text-ink-muted"
              }`}
            >
              {t.nav[id]}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
