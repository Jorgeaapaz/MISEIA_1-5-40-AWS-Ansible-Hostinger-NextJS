import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../app/page";

// Mock next/font — returns no-op variable strings
vi.mock("next/font/google", () => ({
  Unbounded: () => ({ variable: "--font-display", className: "" }),
  Plus_Jakarta_Sans: () => ({ variable: "--font-body", className: "" }),
}));

// Stub CSS imports
vi.mock("../app/globals.css", () => ({}));

describe("Home — landing page AIFormación", () => {
  beforeEach(() => {
    render(<Home />);
  });

  // ── Render ───────────────────────────────────────────────────────
  it("renders without crashing", () => {
    expect(document.body).toBeTruthy();
  });

  // ── Hero section ─────────────────────────────────────────────────
  it("displays the hero headline", () => {
    // h1 has mixed text nodes with <br> and <span> children; match by role
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("DOMINA");
    expect(heading).toHaveTextContent("AHORA");
  });

  it("shows the convocatoria live badge", () => {
    expect(screen.getByText(/Nueva convocatoria/i)).toBeInTheDocument();
  });

  it("shows hero key stats", () => {
    // "3.200+" and "94%" appear in both hero and mentors sections
    expect(screen.getAllByText("3.200+").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Alumnos formados/i)).toBeInTheDocument();
    expect(screen.getAllByText("94%").length).toBeGreaterThanOrEqual(1);
  });

  // ── Navigation ───────────────────────────────────────────────────
  it("renders navigation links for programa, mentores, precios", () => {
    expect(screen.getByRole("link", { name: /programa/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /mentores/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /precios/i })).toBeInTheDocument();
  });

  it("has a nav CTA button", () => {
    expect(screen.getByRole("button", { name: /reservar plaza/i })).toBeInTheDocument();
  });

  // ── Curriculum accordion — initial state ─────────────────────────
  it("module 01 is expanded by default", () => {
    // First module content is visible on initial render
    expect(screen.getByText(/Álgebra lineal y estadística/i)).toBeInTheDocument();
  });

  it("shows all 6 module titles", () => {
    expect(screen.getByText("Fundamentos de Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("Deep Learning y Redes Neuronales")).toBeInTheDocument();
    expect(screen.getByText("NLP y Grandes Modelos de Lenguaje")).toBeInTheDocument();
    expect(screen.getByText("Computer Vision")).toBeInTheDocument();
    expect(screen.getByText("MLOps y Modelos en Producción")).toBeInTheDocument();
    expect(screen.getByText("Proyecto Final con Mentores")).toBeInTheDocument();
  });

  // ── Curriculum accordion — toggle ────────────────────────────────
  it("collapses module 01 when clicked again", () => {
    const mod01Row = screen.getByText("Fundamentos de Machine Learning").closest("[style]")!;
    fireEvent.click(mod01Row);
    expect(screen.queryByText(/Álgebra lineal y estadística/i)).not.toBeInTheDocument();
  });

  it("expands module 02 and shows its topics", () => {
    const mod02Row = screen.getByText("Deep Learning y Redes Neuronales").closest("[style]")!;
    fireEvent.click(mod02Row);
    expect(screen.getByText(/Perceptrones, capas densas/i)).toBeInTheDocument();
  });

  it("opening module 02 collapses module 01", () => {
    // Module 01 is open initially. Click module 02.
    const mod02Row = screen.getByText("Deep Learning y Redes Neuronales").closest("[style]")!;
    fireEvent.click(mod02Row);
    // Module 01 content should no longer be visible
    expect(screen.queryByText(/Álgebra lineal y estadística/i)).not.toBeInTheDocument();
    // Module 02 content should be visible
    expect(screen.getByText(/Perceptrones, capas densas/i)).toBeInTheDocument();
  });

  // ── Features section ─────────────────────────────────────────────
  it("renders 6 feature cards with labels", () => {
    expect(screen.getByText("Online & Flexible")).toBeInTheDocument();
    expect(screen.getByText("Proyectos Reales")).toBeInTheDocument();
    expect(screen.getByText("Mentores Top")).toBeInTheDocument();
    expect(screen.getByText("Certificado Avalado")).toBeInTheDocument();
    expect(screen.getByText("Comunidad Exclusiva")).toBeInTheDocument();
    expect(screen.getByText("Garantía Total")).toBeInTheDocument();
  });

  // ── Pricing section ───────────────────────────────────────────────
  it("renders 3 pricing plan names", () => {
    expect(screen.getByText("Esencial")).toBeInTheDocument();
    expect(screen.getByText("Pro")).toBeInTheDocument();
    expect(screen.getByText("Elite")).toBeInTheDocument();
  });

  it("Pro plan has the MAS POPULAR badge", () => {
    expect(screen.getByText("MÁS POPULAR")).toBeInTheDocument();
  });

  it("renders pricing CTA buttons", () => {
    expect(screen.getByRole("button", { name: /Empezar ahora/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unirme al Pro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Aplicar al Elite/i })).toBeInTheDocument();
  });

  // ── Testimonials section ──────────────────────────────────────────
  it("renders 3 testimonials with names and roles", () => {
    expect(screen.getByText("Alejandro Martínez")).toBeInTheDocument();
    expect(screen.getByText(/Lead ML Engineer · Telefónica/i)).toBeInTheDocument();
    expect(screen.getByText("Laura Sánchez")).toBeInTheDocument();
    expect(screen.getByText(/Senior Data Scientist · BBVA/i)).toBeInTheDocument();
    expect(screen.getByText("Carlos Puente")).toBeInTheDocument();
    expect(screen.getByText(/CTO & Co-founder · FinAI/i)).toBeInTheDocument();
  });

  // ── Footer ────────────────────────────────────────────────────────
  it("footer contains brand name and copyright", () => {
    const footers = screen.getAllByText("AIFormación");
    expect(footers.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/© 2026 AIFormación/i)).toBeInTheDocument();
  });

  it("footer has legal links", () => {
    expect(screen.getByRole("link", { name: /Aviso legal/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Privacidad/i })).toBeInTheDocument();
  });

  // ── Final CTA section ─────────────────────────────────────────────
  it("final CTA shows available seats message", () => {
    expect(screen.getByText(/12 plazas disponibles/i)).toBeInTheDocument();
  });

  it("final CTA has reserve button", () => {
    expect(screen.getByRole("button", { name: /Reservar mi plaza ahora/i })).toBeInTheDocument();
  });
});
