import { expect, test } from "@playwright/test";

function uniqueEmail(): string {
  return `e2e-${Date.now()}-${Math.floor(Math.random() * 10_000)}@example.com`;
}

test.describe("registration → dashboard → plan → logout", () => {
  test("a new user can register, pick a plan, and log out back to the landing page", async ({ page }) => {
    const email = uniqueEmail();

    await page.goto("/");
    await page.getByRole("button", { name: "Reservar plaza" }).click();
    await expect(page).toHaveURL(/\/register$/);

    await page.getByLabel("Nombre completo").fill("Playwright Tester");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Contraseña").fill("Sup3rSecret!");
    await page.getByLabel("País").fill("España");
    await page.getByLabel("Teléfono").fill("+34600111222");
    await page.getByLabel("Edad").fill("30");
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole("button", { name: "Pro" }).click();
    await expect(page.getByRole("button", { name: "Pro" })).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page).toHaveURL("http://localhost:3100/");
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reservar plaza" })).toBeVisible();
  });
});

test.describe("login with a seeded user", () => {
  test("signs in with documented seed credentials and reaches the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("ana.garcia@example.com");
    await page.getByLabel("Contraseña").fill("Ana#Pass2024");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText(/ana.garcia@example.com/i)).toBeVisible();
  });
});

test.describe("error states", () => {
  test("registering with an already-registered email shows an inline error and stays on the form", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Nombre completo").fill("Ana Duplicada");
    await page.getByLabel("Email").fill("ana.garcia@example.com");
    await page.getByLabel("Contraseña").fill("Sup3rSecret!");
    await page.getByLabel("País").fill("España");
    await page.getByLabel("Teléfono").fill("+34600111222");
    await page.getByLabel("Edad").fill("29");
    await page.getByRole("button", { name: "Crear cuenta" }).click();

    await expect(page.getByText(/ya existe una cuenta/i)).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("logging in with the wrong password shows an inline error and sets no session", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("ana.garcia@example.com");
    await page.getByLabel("Contraseña").fill("wrong-password");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText(/credenciales incorrectas/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);

    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === "dominaia_session")).toBeUndefined();
  });
});

test.describe("auth guard", () => {
  test("direct navigation to /dashboard while logged out redirects to /login", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe("accessibility", () => {
  test("the register form can be completed and submitted using only the keyboard", async ({ page }) => {
    const email = uniqueEmail();
    await page.goto("/register");

    await page.getByLabel("Nombre completo").focus();
    await page.keyboard.type("Teclado Accesible");
    await page.keyboard.press("Tab");
    await page.keyboard.type(email);
    await page.keyboard.press("Tab");
    await page.keyboard.type("Sup3rSecret!");
    await page.keyboard.press("Tab");
    await page.keyboard.type("España");
    await page.keyboard.press("Tab");
    await page.keyboard.type("+34600111222");
    await page.keyboard.press("Tab");
    await page.keyboard.type("31");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
