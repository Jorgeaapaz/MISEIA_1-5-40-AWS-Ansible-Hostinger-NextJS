import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Nav from "../../app/components/Nav";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("Nav", () => {
  beforeEach(() => {
    push.mockClear();
  });

  it("renders a Login button and a Reservar plaza button", () => {
    render(<Nav />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reservar plaza/i })).toBeInTheDocument();
  });

  it("routes to /register when Reservar plaza is clicked", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: /reservar plaza/i }));
    expect(push).toHaveBeenCalledWith("/register");
  });

  it("routes to /login when Login is clicked", () => {
    render(<Nav />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(push).toHaveBeenCalledWith("/login");
  });
});
