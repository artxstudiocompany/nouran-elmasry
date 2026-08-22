"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useI18n } from "@/i18n/provider"
import SectionHeading from "@/components/ui/SectionHeading"

type LayerKey = "architecture" | "hvac" | "electrical" | "plumbing" | "fireFighting"

interface LayerDef {
  key: LayerKey
  color: string
  labelKey: string
  defaultOn: boolean
}

const LAYERS: LayerDef[] = [
  { key: "architecture", color: "#9aa3bd", labelKey: "layers.architecture", defaultOn: true },
  { key: "hvac", color: "#22c55e", labelKey: "layers.hvac", defaultOn: false },
  { key: "electrical", color: "#b9c07a", labelKey: "layers.electrical", defaultOn: false },
  { key: "plumbing", color: "#3b82f6", labelKey: "layers.plumbing", defaultOn: false },
  { key: "fireFighting", color: "#ef4444", labelKey: "layers.fireFighting", defaultOn: false },
]

function getNested(obj: Record<string, any>, path: string): string {
  return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? path
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.03, type: "spring", duration: 1.2, bounce: 0 },
      opacity: { delay: i * 0.03, duration: 0.3 },
    },
  }),
}

const fadeOut = {
  exit: { opacity: 0, transition: { duration: 0.4 } },
}

export default function EngineeringViz() {
  const { t } = useI18n()

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    architecture: true,
    hvac: false,
    electrical: false,
    plumbing: false,
    fireFighting: false,
  })

  const toggleLayer = (key: LayerKey) => {
    if (key === "architecture") return
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section id="visualization" className="section-padding relative overflow-hidden bg-night">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading overline="SYSTEMS" title={t.visualization.title} />
        <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-ink-muted">
          {t.visualization.description}
        </p>

        <div className="mt-10 mb-8 flex flex-wrap items-center justify-center gap-3">
          {LAYERS.map((layer) => {
            const active = layers[layer.key]
            const label = getNested(t.visualization, layer.labelKey)
            return (
              <button
                key={layer.key}
                onClick={() => toggleLayer(layer.key)}
                disabled={layer.key === "architecture"}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                  layer.key === "architecture"
                    ? "cursor-default opacity-70"
                    : "cursor-pointer hover:scale-105"
                } ${
                  active
                    ? "border-current bg-night-deep"
                    : "border-night-line bg-transparent text-ink-muted hover:border-current"
                }`}
                style={{ color: active ? layer.color : undefined }}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: active ? layer.color : "transparent",
                    border: `2px solid ${layer.color}`,
                  }}
                />
                {label}
              </button>
            )
          })}
        </div>

        <div className="rounded-2xl border border-night-line bg-night-deep/60 p-4 backdrop-blur-sm sm:p-6 md:p-8">
          <svg viewBox="0 0 800 600" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="50" y1="540" x2="750" y2="540" stroke="#1b2450" strokeWidth="2" />

            <AnimatePresence>
              {layers.architecture && (
                <motion.g key="architecture" initial="hidden" animate="visible" exit="exit" variants={fadeOut}>
                  <motion.rect x="150" y="80" width="500" height="460" rx="2" fill="none" stroke="#9aa3bd" strokeWidth="2" variants={draw} custom={0} />
                  <motion.polyline points="140,80 400,30 660,80" fill="none" stroke="#9aa3bd" strokeWidth="2" variants={draw} custom={1} />
                  <motion.line x1="400" y1="30" x2="400" y2="10" stroke="#9aa3bd" strokeWidth="2" variants={draw} custom={2} />
                  {[170, 260, 350, 440].map((y, i) => (
                    <motion.line key={`floor-${i}`} x1="150" y1={y} x2="650" y2={y} stroke="#1b2450" strokeWidth="1" variants={draw} custom={3 + i} />
                  ))}
                  {[110, 195, 285, 375, 465].map((cy, fi) =>
                    [200, 280, 360, 440, 520, 600].map((cx, wi) => (
                      <motion.rect key={`win-${fi}-${wi}`} x={cx - 12} y={cy - 15} width="24" height="30" rx="1" fill="none" stroke="#1b2450" strokeWidth="1" variants={draw} custom={5 + fi * 6 + wi} />
                    ))
                  )}
                  {[150, 400, 650].map((x, i) => (
                    <motion.line key={`col-${i}`} x1={x} y1="80" x2={x} y2="540" stroke="#1b2450" strokeWidth="1.5" variants={draw} custom={40 + i} />
                  ))}
                  <motion.rect x="370" y="500" width="60" height="40" rx="2" fill="none" stroke="#1b2450" strokeWidth="1.5" variants={draw} custom={44} />
                </motion.g>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {layers.hvac && (
                <motion.g key="hvac" initial="hidden" animate="visible" exit="exit" variants={fadeOut}>
                  <motion.path d="M200,100 L200,520" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" variants={draw} custom={0} />
                  {[130, 215, 305, 395, 485].map((y, i) => (
                    <motion.path key={`hvac-h-${i}`} d={`M200,${y} L620,${y}`} fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" opacity={0.8} variants={draw} custom={1 + i} />
                  ))}
                  {[130, 215, 305, 395, 485].map((y, fi) =>
                    [320, 440, 560].map((x, bi) => (
                      <motion.circle key={`diff-${fi}-${bi}`} cx={x} cy={y + 34} r="4" fill="none" stroke="#22c55e" strokeWidth="1.5" variants={draw} custom={21 + fi * 3 + bi} />
                    ))
                  )}
                </motion.g>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {layers.electrical && (
                <motion.g key="electrical" initial="hidden" animate="visible" exit="exit" variants={fadeOut}>
                  <motion.path d="M600,100 L600,520" fill="none" stroke="#b9c07a" strokeWidth="3" strokeLinecap="round" variants={draw} custom={0} />
                  {[130, 215, 305, 395, 485].map((y, i) => (
                    <motion.path key={`elec-h-${i}`} d={`M600,${y} L180,${y}`} fill="none" stroke="#b9c07a" strokeWidth="2" strokeLinecap="round" opacity={0.8} variants={draw} custom={1 + i} />
                  ))}
                  {[130, 215, 305, 395, 485].map((y, fi) =>
                    [250, 400, 520].map((x, bi) => (
                      <motion.rect key={`jbox-${fi}-${bi}`} x={x - 5} y={y - 5} width="10" height="10" fill="none" stroke="#b9c07a" strokeWidth="1.5" variants={draw} custom={6 + fi * 3 + bi} />
                    ))
                  )}
                </motion.g>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {layers.plumbing && (
                <motion.g key="plumbing" initial="hidden" animate="visible" exit="exit" variants={fadeOut}>
                  <motion.path d="M300,100 L300,520" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" variants={draw} custom={0} />
                  <motion.path d="M500,100 L500,520" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" variants={draw} custom={1} />
                  {[130, 215, 305, 395, 485].map((y, i) => (
                    <motion.path key={`plumb-h-${i}`} d={`M300,${y} L500,${y}`} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity={0.7} variants={draw} custom={2 + i} />
                  ))}
                  {[130, 215, 305, 395, 485].map((y, fi) =>
                    [350, 450].map((x, bi) => (
                      <motion.circle key={`fix-${fi}-${bi}`} cx={x} cy={y + 28} r="3" fill="none" stroke="#3b82f6" strokeWidth="1.5" variants={draw} custom={17 + fi * 2 + bi} />
                    ))
                  )}
                </motion.g>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {layers.fireFighting && (
                <motion.g key="fireFighting" initial="hidden" animate="visible" exit="exit" variants={fadeOut}>
                  <motion.path d="M680,100 L680,520" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" variants={draw} custom={0} />
                  {[130, 215, 305, 395, 485].map((y, i) => (
                    <motion.path key={`fire-h-${i}`} d={`M680,${y} L180,${y}`} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" opacity={0.7} variants={draw} custom={1 + i} />
                  ))}
                  {[130, 215, 305, 395, 485].map((y, fi) =>
                    [240, 340, 440, 560].map((x, si) => (
                      <motion.circle key={`spr-${fi}-${si}`} cx={x} cy={y + 8} r="4" fill="#ef4444" fillOpacity={0.15} stroke="#ef4444" strokeWidth="1.5" variants={draw} custom={6 + fi * 4 + si} />
                    ))
                  )}
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>
      </div>
    </section>
  )
}
