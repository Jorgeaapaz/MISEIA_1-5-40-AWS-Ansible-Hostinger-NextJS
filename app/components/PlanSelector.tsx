"use client";

import { useState } from "react";
import { updateSelectedPlan } from "../lib/apiClient";
import type { Plan } from "../data/plans";

interface PlanSelectorProps {
  plans: Plan[];
  initialSelectedPlan: string | undefined;
}

export default function PlanSelector({ plans, initialSelectedPlan }: PlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(initialSelectedPlan);
  const [pendingPlan, setPendingPlan] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  async function handleSelect(planName: string): Promise<void> {
    setError(undefined);
    setPendingPlan(planName);
    const result = await updateSelectedPlan(planName);
    setPendingPlan(undefined);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSelectedPlan(planName);
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.2rem",
        }}
      >
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.name;
          return (
            <button
              key={plan.name}
              type="button"
              className="plan-option"
              aria-pressed={isSelected}
              onClick={() => handleSelect(plan.name)}
              disabled={pendingPlan === plan.name}
              style={{
                textAlign: "left",
                background: "var(--surface)",
                padding: "1.4rem",
                color: "var(--fg)",
                fontFamily: "var(--font-body, sans-serif)",
              }}
            >
              <p style={{ fontSize: "0.75rem", color: plan.accent, fontWeight: 700, marginBottom: "0.4rem" }}>
                {plan.badge ?? "PLAN"}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 700,
                  fontSize: "1.15rem",
                  marginBottom: "0.3rem",
                }}
              >
                {plan.name}
              </h3>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.6rem" }}>{plan.price}€</p>
              <p style={{ fontSize: "0.82rem", color: "rgba(226,232,240,0.55)" }}>
                {isSelected ? "Plan seleccionado" : pendingPlan === plan.name ? "Guardando…" : "Seleccionar"}
              </p>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="field-error" role="alert" style={{ marginTop: "1rem" }}>
          {error}
        </p>
      )}
    </div>
  );
}
