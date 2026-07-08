"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { loginUser } from "../lib/apiClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitError(undefined);

    const validationErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validationErrors.email = "Introduce un email válido.";
    if (!password) validationErrors.password = "Introduce tu contraseña.";
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await loginUser({ email: email.trim(), password });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors);
      setSubmitError(result.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="auth-field" style={{ marginBottom: "1.1rem" }}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
        />
        {errors.email && (
          <p id="login-email-error" className="field-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="auth-field" style={{ marginBottom: "1.1rem" }}>
        <label htmlFor="login-password">Contraseña</label>
        <input
          id="login-password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
        />
        {errors.password && (
          <p id="login-password-error" className="field-error" role="alert">
            {errors.password}
          </p>
        )}
      </div>

      {submitError && (
        <p className="field-error" role="alert" style={{ marginBottom: "1rem" }}>
          {submitError}
        </p>
      )}

      <button
        type="submit"
        className="btn-glow"
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "100px",
          border: "none",
          color: "#060612",
          fontWeight: 800,
          fontSize: "0.9rem",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
          fontFamily: "var(--font-body, sans-serif)",
        }}
      >
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
