import type { Metadata } from "next";
import Link from "next/link";
import Login from "../components/Login";

export const metadata: Metadata = {
  title: "Iniciar sesión | AIFormación",
};

export default function LoginPage() {
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
          Bienvenido de nuevo
        </h1>
        <p style={{ color: "rgba(226,232,240,0.65)", fontSize: "0.9rem", marginBottom: "1.8rem" }}>
          Inicia sesión para acceder a tu panel.
        </p>
        <Login />
        <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", color: "rgba(226,232,240,0.55)" }}>
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" style={{ color: "#2dd4bf" }}>
            Reserva tu plaza
          </Link>
        </p>
      </div>
    </div>
  );
}
