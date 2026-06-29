export default function CtaSection() {
  return (
    <section style={{ padding: "4rem 2rem 7rem" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center", padding: "5rem 2rem", borderRadius: "28px", border: "1px solid rgba(45,212,191,0.2)", background: "radial-gradient(ellipse at 50% 0%, rgba(45,212,191,0.09) 0%, transparent 65%), var(--surface)", position: "relative", overflow: "hidden" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#2dd4bf", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Plazas limitadas
          </p>
          <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "clamp(2.2rem, 5.5vw, 4rem)", lineHeight: 1.0, letterSpacing: "-0.035em", marginBottom: "1.5rem" }}>
            Tu carrera en IA
            <br />
            empieza hoy.
          </h2>
          <p style={{ fontSize: "1.08rem", color: "rgba(226,232,240,0.58)", marginBottom: "2.5rem", lineHeight: 1.72 }}>
            La próxima convocatoria comienza en septiembre. Quedan{" "}
            <strong style={{ color: "#f97316" }}>12 plazas disponibles</strong>.
          </p>
          <button className="btn-glow" style={{ padding: "18px 56px", borderRadius: "100px", border: "none", color: "#060612", fontWeight: 800, fontSize: "1.1rem", cursor: "pointer", fontFamily: "var(--font-body, sans-serif)" }}>
            Reservar mi plaza ahora →
          </button>
          <p style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "rgba(226,232,240,0.3)" }}>
            Sin compromiso · Garantía de 30 días · Pago seguro
          </p>
        </div>
      </div>
    </section>
  );
}
