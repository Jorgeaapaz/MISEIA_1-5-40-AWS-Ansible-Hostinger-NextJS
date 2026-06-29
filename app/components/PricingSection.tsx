"use client";

import { PLANS } from "../data/plans";

export default function PricingSection() {
  return (
    <section id="precios" style={{ padding: "7rem 2rem", background: "rgba(255,255,255,0.012)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#f97316", textTransform: "uppercase", marginBottom: "1rem" }}>
            Inversión
          </p>
          <h2 style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.75rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Elige tu
            <br />
            <span style={{ color: "#f97316" }}>nivel de acceso.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.25rem" }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className="card-lift" style={{ position: "relative", borderRadius: "20px", border: `1px solid ${plan.featured ? plan.accent + "55" : "var(--border)"}`, background: plan.featured ? "rgba(129,140,248,0.07)" : "var(--surface)", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", padding: "4px 18px", borderRadius: "100px", background: plan.accent, color: "#060612", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}

              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", color: plan.accent, textTransform: "uppercase", marginBottom: "0.6rem" }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                  <span style={{ fontSize: "0.9rem", color: "rgba(226,232,240,0.45)" }}>€</span>
                  <span style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 900, fontSize: "3.2rem", color: "#e2e8f0", letterSpacing: "-0.04em", lineHeight: 1 }}>{plan.price}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(226,232,240,0.38)", marginTop: "3px" }}>pago único · sin suscripción</div>
              </div>

              <ul style={{ display: "flex", flexDirection: "column", gap: "0.7rem", listStyle: "none", flex: 1 }}>
                {plan.perks.map((perk) => (
                  <li key={perk} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.88rem", color: "rgba(226,232,240,0.78)" }}>
                    <span style={{ color: plan.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>

              <button
                style={{ width: "100%", padding: "14px", borderRadius: "100px", border: `1px solid ${plan.accent}`, background: plan.featured ? plan.accent : "transparent", color: plan.featured ? "#060612" : plan.accent, fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", fontFamily: "var(--font-body, sans-serif)", transition: "background 0.2s" }}
                onMouseEnter={(e) => { if (!plan.featured) e.currentTarget.style.background = `${plan.accent}18`; }}
                onMouseLeave={(e) => { if (!plan.featured) e.currentTarget.style.background = "transparent"; }}
              >
                {plan.cta} →
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.78rem", color: "rgba(226,232,240,0.3)" }}>
          *La garantía de entrevistas aplica a candidatos que completan el 100% del programa. Consulta condiciones.
        </p>
      </div>
    </section>
  );
}
