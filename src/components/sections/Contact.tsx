"use client";

import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import { MailIcon, PhoneIcon } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useSiteData } from "@/store/DataContext";
import SectionHeading from "@/components/ui/SectionHeading";

const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID || "placeholder";

export default function Contact() {
  const { t } = useI18n();
  const { profile } = useSiteData();
  const [state, handleSubmit] = useForm(formId);

  const field =
    "w-full rounded-lg border border-white/10 bg-night-deep/70 px-4 py-3 text-[15px] text-ink placeholder:text-ink-muted/70 transition-colors duration-150 ease-out focus:border-glow/60 focus:outline-none focus:ring-1 focus:ring-glow/40";

  return (
    <section id="contact" className="px-4 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeading overline="CONTACT" title={t.contact.title} />

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-6">
            <p className="text-[17px] leading-relaxed text-ink-muted">{t.contact.description}</p>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-[15px] text-ink transition-colors duration-150 ease-out hover:text-glow"
                >
                  <MailIcon className="h-[18px] w-[18px] shrink-0 text-glow" aria-hidden="true" />
                  <span className="font-latin" dir="ltr">
                    {profile.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 text-[15px] text-ink transition-colors duration-150 ease-out hover:text-glow"
                >
                  <PhoneIcon className="h-[18px] w-[18px] shrink-0 text-glow" aria-hidden="true" />
                  <span className="font-latin" dir="ltr">
                    {profile.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-[15px] text-ink transition-colors duration-150 ease-out hover:text-glow"
                >
                  <svg className="h-[18px] w-[18px] shrink-0 text-glow" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

          {state.succeeded ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-glow/25 bg-glow/[0.06] px-6 py-14 text-center"
            >
              <p className="text-lg font-semibold text-glow-strong">{t.contact.success}</p>
              <p className="text-sm text-ink-muted">{t.contact.successDetail}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/5 bg-night-panel/60 p-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-ink-muted">
                  {t.contact.name}
                </label>
                <input id="name" name="name" className={field} required />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-ink-muted">
                  {t.contact.email}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  dir="ltr"
                  className={`${field} font-latin`}
                  required
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-ink-muted">
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className={`${field} resize-none`}
                  required
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />
              </div>

              <button
                type="submit"
                disabled={state.submitting}
                className="hex-clip w-full bg-glow/15 px-8 py-3 text-[15px] font-semibold text-glow-strong ring-1 ring-glow/70 transition-[background-color,color] duration-150 ease-out hover:bg-glow/25 focus:outline-none focus-visible:ring-2 disabled:opacity-60"
              >
                {state.submitting ? t.contact.sending : t.contact.send}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
