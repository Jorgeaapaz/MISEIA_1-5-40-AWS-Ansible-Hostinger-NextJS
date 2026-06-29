export interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
  color: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Alejandro Martínez",
    role: "Lead ML Engineer · Telefónica",
    text: "En 6 meses pasé de backend developer a liderar el equipo de IA de mi empresa. El nivel de los mentores y la calidad de los proyectos es incomparable.",
    initials: "AM",
    color: "#2dd4bf",
  },
  {
    name: "Laura Sánchez",
    role: "Senior Data Scientist · BBVA",
    text: "El programa es brutalmente práctico. Nada de diapositivas vacías: construyes sistemas reales desde el primer día. Me triplicaron el sueldo al mes de terminar.",
    initials: "LS",
    color: "#818cf8",
  },
  {
    name: "Carlos Puente",
    role: "CTO & Co-founder · FinAI",
    text: "El proyecto final fue la demo técnica que usé para levantar una ronda seed de €500K. Invertir en este programa fue la decisión más inteligente de mi carrera.",
    initials: "CP",
    color: "#f97316",
  },
];
