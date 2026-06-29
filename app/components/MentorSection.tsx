const MENTOR_STATS = [
  { num: "12", label: "publicaciones en NeurIPS / ICML", icon: "📄" },
  { num: "3.200+", label: "profesionales formados", icon: "👥" },
  { num: "8", label: "startups de IA fundadas por alumni", icon: "🚀" },
  { num: "94%", label: "de alumni trabajan en IA", icon: "🎯" },
];

const MENTOR_TAGS = ["Google DeepMind", "Meta AI", "OpenAI Partner", "15+ años"];

export default function MentorSection() {
  return (
    <section id="mentores" style={{ padding: "7rem 2rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "4rem", alignItems: "center" }}>
        <div>
          <div style={{ width: "110px", height: "110px", borderRadius: "22px", background: "linear-gradient(135deg, rgba(45,212,191,0.14), rgba(129,140,248,0.2))", border: "1px solid rgba(45,212,191,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.2rem", marginBottom: "2rem" }}>
            👩‍💻
          </div>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#2dd4bf", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Directora del Programa
          </p>
          <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "clamp(2rem, 4.5vw, 3rem)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            Dra. María
            <br />
            Rodríguez
          </h2>
          <p style={{ fontSize: "0.98rem", color: "rgba(226,232,240,0.62)", lineHeight: 1.8, marginBottom: "2rem" }}>
            Ex-Research Engineer en Google DeepMind y ex-Staff Engineer en Meta AI. Doctora en Machine Learning por la UPM con más de 15 años aplicando IA en producción a escala global. Ponente habitual en NeurIPS e ICML.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {MENTOR_TAGS.map((tag) => (
              <span key={tag} style={{ padding: "5px 14px", borderRadius: "100px", border: "1px solid rgba(45,212,191,0.22)", background: "rgba(45,212,191,0.05)", fontSize: "0.78rem", color: "#2dd4bf" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {MENTOR_STATS.map(({ num, label, icon }) => (
            <div key={label} className="card-lift" style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)" }}>
              <div style={{ fontSize: "1.5rem", width: "46px", textAlign: "center", flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "1.6rem", color: "#2dd4bf", letterSpacing: "-0.03em" }}>{num}</div>
                <div style={{ fontSize: "0.82rem", color: "rgba(226,232,240,0.55)", marginTop: "1px" }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
