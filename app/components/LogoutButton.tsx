"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "../lib/apiClient";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(): Promise<void> {
    setIsLoggingOut(true);
    await logoutUser();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      className="btn-ghost"
      onClick={handleLogout}
      disabled={isLoggingOut}
      style={{
        padding: "9px 20px",
        borderRadius: "100px",
        fontWeight: 700,
        fontSize: "0.82rem",
        cursor: isLoggingOut ? "not-allowed" : "pointer",
        fontFamily: "var(--font-body, sans-serif)",
      }}
    >
      {isLoggingOut ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
