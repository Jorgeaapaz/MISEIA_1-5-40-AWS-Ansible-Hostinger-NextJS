"use client";

const STATS = [
  { val: "3.200+", label: "Alumnos formados" },
  { val: "94%", label: "Tasa de empleo en IA" },
  { val: "4.9★", label: "Valoración media" },
  { val: "6 meses", label: "Duración total" },
];

export default function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingTop: "80px",
        overflow: "hidden",
      }}
    >
      <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: "5%", left: "8%", width: "560px", height: "560px", borderRadius: "50%", background: "radial-gradient(circle, rgba(45,212,191,0.16) 0%, transparent 68%)", animation: "orb-drift 9s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "5%", width: "440px", height: "440px", borderRadius: "50%", background: "radial-gradient(circle, rgba(129,140,248,0.14) 0%, transparent 68%)", animation: "orb-drift 11s ease-in-out infinite reverse", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "45%", right: "18%", width: "320px", height: "320px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 68%)", animation: "orb-drift 13s ease-in-out infinite 3s", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "0 2rem", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "100px",
            border: "1px solid rgba(45,212,191,0.3)",
            background: "rgba(45,212,191,0.06)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#2dd4bf",
            marginBottom: "2.5rem",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#2dd4bf", display: "inline-block", animation: "dot-pulse 2s ease-in-out infinite" }} />
          Nueva convocatoria · Septiembre 2026
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display, sans-serif)",
            fontWeight: 900,
            fontSize: "clamp(3.5rem, 9.5vw, 9rem)",
            letterSpacing: "-0.035em",
            lineHeight: 0.88,
            color: "#e2e8f0",
            marginBottom: "1.5rem",
          }}
        >
          DOMINA
          <br />
          <span className="gradient-text">LA IA</span>
          <br />
          AHORA
        </h1>

        <p style={{ fontSize: "clamp(1rem, 2.2vw, 1.22rem)", color: "rgba(226,232,240,0.62)", maxWidth: "600px", margin: "0 auto 3rem", lineHeight: 1.75 }}>
          El programa de formación más exigente y práctico para profesionales que quieren liderar la revolución de la inteligencia artificial.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-glow" style={{ padding: "17px 44px", borderRadius: "100px", border: "none", color: "#060612", fontWeight: 800, fontSize: "1.05rem", cursor: "pointer", fontFamily: "var(--font-body, sans-serif)" }}>
            Empieza ahora →
          </button>
          <button
            style={{ padding: "17px 44px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.14)", background: "transparent", color: "#e2e8f0", fontWeight: 600, fontSize: "1.05rem", cursor: "pointer", fontFamily: "var(--font-body, sans-serif)", transition: "border-color 0.2s, background 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(45,212,191,0.45)"; e.currentTarget.style.background = "rgba(45,212,191,0.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; e.currentTarget.style.background = "transparent"; }}
          >
            Ver el programa ↓
          </button>
        </div>

        <div style={{ marginTop: "4.5rem", display: "flex", gap: "3rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {STATS.map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "1.9rem", color: "#2dd4bf", letterSpacing: "-0.03em" }}>{val}</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(226,232,240,0.45)", marginTop: "3px", letterSpacing: "0.01em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
