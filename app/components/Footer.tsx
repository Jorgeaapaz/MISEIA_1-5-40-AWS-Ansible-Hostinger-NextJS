const FOOTER_LINKS = ["Aviso legal", "Privacidad", "Cookies", "Contacto"];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", padding: "2.5rem 2rem" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg, #2dd4bf, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px" }}>
            🧠
          </div>
          <span style={{ fontFamily: "var(--font-display, sans-serif)", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "-0.01em" }}>
            AIFormación
          </span>
        </div>

        <div style={{ display: "flex", gap: "1.75rem", flexWrap: "wrap" }}>
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" className="link-fade" style={{ fontSize: "0.82rem" }}>
              {link}
            </a>
          ))}
        </div>

        <div style={{ fontSize: "0.78rem", color: "rgba(226,232,240,0.28)" }}>
          © 2026 AIFormación. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
