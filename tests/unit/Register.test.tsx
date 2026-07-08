import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Register from "../../app/components/Register";
import { registerUser } from "../../app/lib/apiClient";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("../../app/lib/apiClient", () => ({
  registerUser: vi.fn(),
}));

describe("Register", () => {
  beforeEach(() => {
    push.mockClear();
    vi.mocked(registerUser).mockReset();
  });

  it("renders all required labeled fields", () => {
    render(<Register />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/país/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
  });

  it("shows validation errors wired via aria-describedby on submit with empty fields", async () => {
    render(<Register />);
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    const emailInput = screen.getByLabelText(/^email$/i);
    await waitFor(() => expect(emailInput).toHaveAttribute("aria-invalid", "true"));
    const describedBy = emailInput.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)).toHaveTextContent(/email/i);
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("submits valid data and redirects to the dashboard", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      ok: true,
      data: {
        user: {
          id: "1",
          email: "ana@example.com",
          name: "Ana García",
          country: "España",
          phone: "+34600111222",
          age: 29,
          selectedPlan: undefined,
        },
      },
    });

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: "Ana García" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "Sup3rSecret!" } });
    fireEvent.change(screen.getByLabelText(/país/i), { target: { value: "España" } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "+34600111222" } });
    fireEvent.change(screen.getByLabelText(/edad/i), { target: { value: "29" } });

    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => expect(registerUser).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows the server error message on a duplicate-email conflict", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      ok: false,
      errors: {},
      message: "Ya existe una cuenta con este email.",
    });

    render(<Register />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: "Ana García" } });
    fireEvent.change(screen.getByLabelText(/^email$/i), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "Sup3rSecret!" } });
    fireEvent.change(screen.getByLabelText(/país/i), { target: { value: "España" } });
    fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: "+34600111222" } });
    fireEvent.change(screen.getByLabelText(/edad/i), { target: { value: "29" } });
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    await waitFor(() => expect(screen.getByText(/ya existe una cuenta/i)).toBeInTheDocument());
    expect(push).not.toHaveBeenCalled();
  });
});
