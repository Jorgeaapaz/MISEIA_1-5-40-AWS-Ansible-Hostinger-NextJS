"use client";

import { useState } from "react";
import { MODULES } from "../data/curriculum";

export default function CurriculumSection() {
  const [activeModule, setActiveModule] = useState<number | null>(0);

  return (
    <section id="programa" style={{ padding: "7rem 2rem", background: "rgba(255,255,255,0.012)" }}>
      <div style={{ maxWidth: "880px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#818cf8", textTransform: "uppercase", marginBottom: "1rem" }}>
            Contenidos
          </p>
          <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.75rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            22 semanas.
            <br />
            <span style={{ color: "#818cf8" }}>6 módulos.</span>
            <br />
            Resultados reales.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {MODULES.map((mod, i) => (
            <div
              key={i}
              className="module-row"
              onClick={() => setActiveModule(activeModule === i ? null : i)}
              style={{
                border: "1px solid",
                borderColor: activeModule === i ? `${mod.color}45` : "var(--border)",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                background: activeModule === i ? `${mod.color}08` : "transparent",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                  <span style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "1.6rem", color: mod.color, opacity: 0.65, minWidth: "44px", lineHeight: 1 }}>
                    {mod.num}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.3 }}>{mod.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "rgba(226,232,240,0.45)", marginTop: "3px" }}>{mod.weeks}</div>
                  </div>
                </div>
                <div style={{ fontSize: "1.4rem", color: mod.color, transition: "transform 0.3s ease", transform: activeModule === i ? "rotate(45deg)" : "rotate(0deg)", flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>
                  +
                </div>
              </div>

              {activeModule === i && (
                <div style={{ padding: "0 1.5rem 1.5rem", paddingLeft: "calc(1.5rem + 44px + 1.25rem)" }}>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem", listStyle: "none" }}>
                    {mod.topics.map((topic, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.88rem", color: "rgba(226,232,240,0.75)", lineHeight: 1.5 }}>
                        <span style={{ color: mod.color, flexShrink: 0, marginTop: "1px" }}>→</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
