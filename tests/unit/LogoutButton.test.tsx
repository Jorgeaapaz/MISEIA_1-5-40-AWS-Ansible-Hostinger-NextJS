import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LogoutButton from "../../app/components/LogoutButton";
import { logoutUser } from "../../app/lib/apiClient";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("../../app/lib/apiClient", () => ({
  logoutUser: vi.fn(),
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
    vi.mocked(logoutUser).mockReset().mockResolvedValue(undefined);
  });

  it("calls logoutUser and redirects to the landing page", async () => {
    render(<LogoutButton />);
    fireEvent.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    await waitFor(() => expect(logoutUser).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/"));
  });
});
