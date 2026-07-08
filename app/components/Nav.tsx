"use client";

import { useRouter } from "next/navigation";

export default function Nav() {
  const router = useRouter();

  return (
    <nav className="nav-glass" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "9px",
              background: "linear-gradient(135deg, #2dd4bf, #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              flexShrink: 0,
            }}
          >
            🧠
          </div>
          <span
            style={{
              fontFamily: "var(--font-display, sans-serif)",
              fontWeight: 700,
              fontSize: "0.88rem",
              letterSpacing: "-0.02em",
            }}
          >
            AIFormación
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <div style={{ display: "flex", gap: "2rem" }}>
            {["programa", "mentores", "precios"].map((id) => (
              <a key={id} href={`#${id}`} className="nav-link" style={{ textTransform: "capitalize" }}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push("/login")}
              style={{
                padding: "9px 20px",
                borderRadius: "100px",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "var(--font-body, sans-serif)",
                letterSpacing: "0.01em",
              }}
            >
              Login
            </button>
            <button
              type="button"
              className="btn-glow"
              onClick={() => router.push("/register")}
              style={{
                padding: "9px 22px",
                borderRadius: "100px",
                border: "none",
                color: "#060612",
                fontWeight: 800,
                fontSize: "0.82rem",
                cursor: "pointer",
                fontFamily: "var(--font-body, sans-serif)",
                letterSpacing: "0.01em",
              }}
            >
              Reservar plaza
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
