"use client";

import { useI18n } from "@/i18n/provider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-white/5 px-6 py-8 text-center text-sm text-ink-muted">
      <p>
        <span className="font-latin">{t.footer.copyright}</span>
      </p>
    </footer>
  );
}
