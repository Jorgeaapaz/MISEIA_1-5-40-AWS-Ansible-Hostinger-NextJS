import { TESTIMONIALS } from "../data/testimonials";

export default function TestimonialsSection() {
  return (
    <section style={{ padding: "7rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#2dd4bf", textTransform: "uppercase", marginBottom: "1rem" }}>
            Testimonios
          </p>
          <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Lo dicen quienes ya
            <br />
            <span className="gradient-text">lo vivieron.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.25rem" }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card-lift" style={{ padding: "2rem", borderRadius: "16px", border: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ fontSize: "2.8rem", color: t.color, opacity: 0.55, lineHeight: 1, fontFamily: "Georgia, serif" }}>&ldquo;</div>
              <p style={{ fontSize: "0.93rem", color: "rgba(226,232,240,0.78)", lineHeight: 1.78, flex: 1 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}40, ${t.color}1a)`, border: `1px solid ${t.color}38`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: "0.78rem", color: t.color, flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.78rem", color: "rgba(226,232,240,0.45)", marginTop: "1px" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
