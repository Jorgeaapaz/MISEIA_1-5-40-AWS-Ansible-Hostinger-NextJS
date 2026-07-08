import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PlanSelector from "../../app/components/PlanSelector";
import { PLANS } from "../../app/data/plans";
import { updateSelectedPlan } from "../../app/lib/apiClient";

vi.mock("../../app/lib/apiClient", () => ({
  updateSelectedPlan: vi.fn(),
}));

describe("PlanSelector", () => {
  beforeEach(() => {
    vi.mocked(updateSelectedPlan).mockReset();
  });

  it("renders all PLANS entries", () => {
    render(<PlanSelector plans={PLANS} initialSelectedPlan={undefined} />);
    for (const plan of PLANS) {
      expect(screen.getByText(plan.name)).toBeInTheDocument();
    }
  });

  it("marks the initially selected plan as pressed", () => {
    render(<PlanSelector plans={PLANS} initialSelectedPlan="Pro" />);
    const proButton = screen.getByText("Pro").closest("button")!;
    expect(proButton).toHaveAttribute("aria-pressed", "true");
  });

  it("calls updateSelectedPlan with the chosen plan name and marks it selected", async () => {
    vi.mocked(updateSelectedPlan).mockResolvedValue({
      ok: true,
      data: {
        user: {
          id: "1",
          email: "ana@example.com",
          name: "Ana",
          country: "España",
          phone: "+34600111222",
          age: 29,
          selectedPlan: "Elite",
        },
      },
    });

    render(<PlanSelector plans={PLANS} initialSelectedPlan={undefined} />);
    const eliteButton = screen.getByText("Elite").closest("button")!;
    fireEvent.click(eliteButton);

    await waitFor(() => expect(updateSelectedPlan).toHaveBeenCalledWith("Elite"));
    await waitFor(() => expect(eliteButton).toHaveAttribute("aria-pressed", "true"));
  });
});
