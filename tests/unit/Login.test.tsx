import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../../app/components/Login";
import { loginUser } from "../../app/lib/apiClient";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("../../app/lib/apiClient", () => ({
  loginUser: vi.fn(),
}));

describe("Login", () => {
  beforeEach(() => {
    push.mockClear();
    vi.mocked(loginUser).mockReset();
  });

  it("renders labeled email and password fields", () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  });

  it("logs in with correct credentials and redirects to the dashboard", async () => {
    vi.mocked(loginUser).mockResolvedValue({
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

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "Sup3rSecret!" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(loginUser).toHaveBeenCalledWith({ email: "ana@example.com", password: "Sup3rSecret!" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
  });

  it("shows an inline error and does not navigate on wrong credentials", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      ok: false,
      errors: {},
      message: "Credenciales incorrectas.",
    });

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "ana@example.com" } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: "wrong-password" } });
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument());
    expect(push).not.toHaveBeenCalled();
  });
});
