import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "../../server/lib/constants";
import type { PublicUser } from "../../server/types";
import LogoutButton from "../components/LogoutButton";
import PlanSelector from "../components/PlanSelector";
import { PLANS } from "../data/plans";

export const metadata: Metadata = {
  title: "Tu panel | AIFormación",
};

async function fetchCurrentUser(token: string): Promise<PublicUser | undefined> {
  const apiUrl = process.env.EXPRESS_API_URL ?? "http://localhost:4000";
  const response = await fetch(`${apiUrl}/api/users/me`, {
    headers: { Cookie: `${AUTH_COOKIE_NAME}=${token}` },
    cache: "no-store",
  });
  if (!response.ok) return undefined;
  const body = (await response.json()) as { user: PublicUser };
  return body.user;
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    redirect("/login");
  }

  const user = await fetchCurrentUser(token);
  if (!user) {
    redirect("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--fg)",
        fontFamily: "var(--font-body, sans-serif)",
        padding: "2.5rem 2rem",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontWeight: 700,
                fontSize: "1.8rem",
              }}
            >
              Hola, {user.name.split(" ")[0]}
            </h1>
            <p style={{ color: "rgba(226,232,240,0.6)", fontSize: "0.9rem" }}>{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <h2
          style={{
            fontFamily: "var(--font-display, sans-serif)",
            fontWeight: 700,
            fontSize: "1.2rem",
            marginBottom: "1.2rem",
          }}
        >
          Elige tu plan
        </h2>
        <PlanSelector plans={PLANS} initialSelectedPlan={user.selectedPlan} />
      </div>
    </div>
  );
}
