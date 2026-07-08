"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { registerUser } from "../lib/apiClient";

interface FormState {
  email: string;
  password: string;
  name: string;
  country: string;
  phone: string;
  age: string;
}

const INITIAL_STATE: FormState = {
  email: "",
  password: "",
  name: "",
  country: "",
  phone: "",
  age: "",
};

function validate(form: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Introduce un email válido.";
  if (form.password.length < 8) errors.password = "La contraseña debe tener al menos 8 caracteres.";
  if (form.name.trim().length < 2) errors.name = "Introduce tu nombre completo.";
  if (form.country.trim().length < 2) errors.country = "Introduce tu país.";
  if (!/^[+]?[\d\s()-]{6,20}$/.test(form.phone)) errors.phone = "Introduce un teléfono válido.";
  const age = Number(form.age);
  if (!form.age || Number.isNaN(age) || age < 16 || age > 120) errors.age = "La edad debe estar entre 16 y 120.";
  return errors;
}

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field: keyof FormState, value: string): void {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitError(undefined);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    const result = await registerUser({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      country: form.country.trim(),
      phone: form.phone.trim(),
      age: Number(form.age),
    });
    setIsSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors);
      setSubmitError(result.message);
      return;
    }

    router.push("/dashboard");
  }

  const fields: Array<{ id: keyof FormState; label: string; type: string }> = [
    { id: "name", label: "Nombre completo", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Contraseña", type: "password" },
    { id: "country", label: "País", type: "text" },
    { id: "phone", label: "Teléfono", type: "tel" },
    { id: "age", label: "Edad", type: "number" },
  ];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {fields.map(({ id, label, type }) => (
        <div key={id} className="auth-field" style={{ marginBottom: "1.1rem" }}>
          <label htmlFor={`register-${id}`}>{label}</label>
          <input
            id={`register-${id}`}
            name={id}
            type={type}
            value={form[id]}
            onChange={(event) => handleChange(id, event.target.value)}
            aria-invalid={Boolean(errors[id])}
            aria-describedby={errors[id] ? `register-${id}-error` : undefined}
          />
          {errors[id] && (
            <p id={`register-${id}-error`} className="field-error" role="alert">
              {errors[id]}
            </p>
          )}
        </div>
      ))}

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
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
