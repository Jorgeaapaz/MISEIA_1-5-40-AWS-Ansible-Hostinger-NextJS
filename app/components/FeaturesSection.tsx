import { FEATURES } from "../data/features";

export default function FeaturesSection() {
  return (
    <section style={{ padding: "7rem 2rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#2dd4bf", textTransform: "uppercase", marginBottom: "1rem" }}>
            Por qué elegirnos
          </p>
          <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.75rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            No es un curso más.
            <br />
            <span className="gradient-text">Es otra liga.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {FEATURES.map((f) => (
            <div key={f.label} className="card-lift" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "2rem" }}>{f.icon}</div>
                <div style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "1.85rem", color: "#2dd4bf", letterSpacing: "-0.03em" }}>{f.stat}</div>
              </div>
              <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>{f.label}</h3>
              <p style={{ fontSize: "0.9rem", color: "rgba(226,232,240,0.58)", lineHeight: 1.65 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
