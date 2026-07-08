import type { Metadata } from "next";
import Link from "next/link";
import Register from "../components/Register";

export const metadata: Metadata = {
  title: "Crear cuenta | AIFormación",
};

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "var(--bg)",
        color: "var(--fg)",
        fontFamily: "var(--font-body, sans-serif)",
      }}
    >
      <div className="auth-card" style={{ width: "100%", maxWidth: "440px", padding: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display, sans-serif)",
            fontWeight: 700,
            fontSize: "1.6rem",
            marginBottom: "0.4rem",
          }}
        >
          Reserva tu plaza
        </h1>
        <p style={{ color: "rgba(226,232,240,0.65)", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
          Crea tu cuenta para elegir tu plan y empezar.
        </p>
        <Register />
        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "rgba(226,232,240,0.55)" }}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" style={{ color: "#2dd4bf" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
