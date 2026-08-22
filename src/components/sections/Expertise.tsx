"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useI18n } from "@/i18n/provider"
import { expertise } from "@/data/skills"

function HvacSvg({ color }: { color: string }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="8" y="24" width="64" height="12" rx="6" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <rect x="8" y="44" width="44" height="10" rx="5" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <line x1="40" y1="36" x2="40" y2="44" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <path d="M20 18 Q28 22, 36 18" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M26 12 Q34 16, 42 12" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M32 30 Q40 26, 48 30" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M40 54 Q48 50, 56 54" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
      <circle cx="40" cy="30" r="3" fill={color} opacity="0.2" />
    </svg>
  )
}

function ElectricalSvg({ color }: { color: string }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M30 10 L22 38 H36 L28 70" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <line x1="46" y1="14" x2="46" y2="32" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="52" y1="14" x2="52" y2="28" stroke={color} strokeWidth="1" opacity="0.25" />
      <line x1="58" y1="20" x2="58" y2="36" stroke={color} strokeWidth="1" opacity="0.2" />
      <circle cx="46" cy="38" r="2" fill={color} opacity="0.4" />
      <circle cx="52" cy="38" r="2" fill={color} opacity="0.3" />
      <circle cx="58" cy="42" r="2" fill={color} opacity="0.25" />
      <line x1="44" y1="38" x2="40" y2="38" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="50" y1="38" x2="50" y2="50" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="50" y1="50" x2="60" y2="50" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <circle cx="60" cy="50" r="4" stroke={color} strokeWidth="1" opacity="0.3" fill="none" />
    </svg>
  )
}

function PlumbingSvg({ color }: { color: string }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M16 20 L16 40 Q16 50, 26 50 L40 50" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" fill="none" />
      <path d="M40 50 L40 60 Q40 66, 46 66 L64 66" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" fill="none" />
      <circle cx="16" cy="16" r="4" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" />
      <circle cx="64" cy="66" r="4" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M24 30 Q32 26, 40 30" stroke={color} strokeWidth="0.8" opacity="0.3" fill="none" />
      <path d="M20 36 Q28 32, 36 36" stroke={color} strokeWidth="0.8" opacity="0.25" fill="none" />
      <path d="M44 56 Q52 52, 60 56" stroke={color} strokeWidth="0.8" opacity="0.25" fill="none" />
      <line x1="40" y1="44" x2="40" y2="50" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

function FireFightingSvg({ color }: { color: string }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M40 12 L32 36 H48 Z" stroke={color} strokeWidth="1.5" opacity="0.5" fill="none" />
      <line x1="40" y1="36" x2="40" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="40" y1="44" x2="24" y2="56" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <line x1="40" y1="44" x2="56" y2="56" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <circle cx="24" cy="56" r="3" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
      <circle cx="40" cy="56" r="3" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
      <circle cx="56" cy="56" r="3" stroke={color} strokeWidth="1" opacity="0.4" fill="none" />
      <path d="M36 24 Q40 20, 44 24" stroke={color} strokeWidth="0.8" opacity="0.3" fill="none" />
      <circle cx="40" cy="18" r="2" fill={color} opacity="0.2" />
    </svg>
  )
}

function BimSvg({ color }: { color: string }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M20 30 L40 18 L60 30 L40 42 Z" stroke={color} strokeWidth="1.5" opacity="0.6" fill="none" />
      <path d="M40 42 L40 62" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M20 30 L20 50 L40 62" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M60 30 L60 50 L40 62" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M20 30 L40 18 L60 30" stroke={color} strokeWidth="1.5" opacity="0.5" fill="none" />
      <line x1="28" y1="36" x2="28" y2="46" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="34" y1="32" x2="34" y2="24" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="46" y1="32" x2="46" y2="24" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <line x1="52" y1="36" x2="52" y2="46" stroke={color} strokeWidth="0.8" opacity="0.2" />
      <circle cx="40" cy="30" r="3" fill={color} opacity="0.15" />
    </svg>
  )
}

const iconMap: Record<string, React.FC<{ color: string }>> = {
  hvac: HvacSvg,
  electrical: ElectricalSvg,
  plumbing: PlumbingSvg,
  fire: FireFightingSvg,
  bim: BimSvg,
}

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

function ExpertiseRow({ item, index }: { item: (typeof expertise)[number]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { locale } = useI18n()
  const Icon = iconMap[item.icon]

  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex items-center gap-6 md:gap-12 py-10 md:py-14 border-b border-white/5 last:border-b-0"
      data-cursor="pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={{
          background: hovered
            ? `radial-gradient(ellipse at center, ${item.color}08 0%, transparent 70%)`
            : "transparent",
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Number */}
      <div className="relative flex-shrink-0 w-20 md:w-32 lg:w-40">
        <motion.span
          className="block font-mono text-5xl md:text-7xl lg:text-8xl font-bold select-none"
          style={{ color: item.color }}
          animate={{ opacity: hovered ? 0.3 : 0.1 }}
          transition={{ duration: 0.4 }}
        >
          {item.number}
        </motion.span>
        {/* Colored line extending on hover */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{ backgroundColor: item.color }}
          animate={{ width: hovered ? "100%" : "0%", opacity: hovered ? 0.6 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Title */}
      <div className="relative flex-1 min-w-0">
        <motion.h3
          className="text-xl md:text-2xl font-bold text-text"
          animate={{ x: hovered ? 8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {locale === "ar" ? item.titleAr : item.title}
        </motion.h3>
        <motion.p
          className="text-text-dim text-sm md:text-base mt-1"
          animate={{ opacity: hovered ? 1 : 0.6, x: hovered ? 8 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {locale === "ar" ? item.title : item.titleAr}
        </motion.p>
      </div>

      {/* SVG Visual */}
      <div className="flex-shrink-0 hidden md:block">
        <motion.div
          animate={{
            scale: hovered ? 1.1 : 1,
            filter: hovered ? `drop-shadow(0 0 12px ${item.color}40)` : `drop-shadow(0 0 0px transparent)`,
          }}
          transition={{ duration: 0.4 }}
        >
          {Icon && <Icon color={item.color} />}
        </motion.div>
      </div>

      {/* Mobile: simplified icon */}
      <div className="flex-shrink-0 md:hidden">
        <motion.div
          animate={{
            scale: hovered ? 1.05 : 1,
            filter: hovered ? `drop-shadow(0 0 8px ${item.color}30)` : `drop-shadow(0 0 0px transparent)`,
          }}
          transition={{ duration: 0.4 }}
        >
          {Icon && <Icon color={item.color} />}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Expertise() {
  const { t } = useI18n()

  return (
    <section
      id="expertise"
      className="section-padding relative"
    >
      <div className="blueprint-grid absolute inset-0 opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="text-text-dim font-mono text-sm tracking-widest uppercase">
            02
          </span>
          <h2 className="text-gradient-gold text-4xl md:text-5xl lg:text-6xl font-bold mt-3">
            {t.expertise.title}
          </h2>
        </motion.div>

        {/* Expertise Rows */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {expertise.map((item, index) => (
            <ExpertiseRow key={item.id} item={item} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
