export interface Plan {
  name: string;
  price: string;
  badge: string | null;
  accent: string;
  featured: boolean;
  perks: string[];
  cta: string;
}

export const PLANS: Plan[] = [
  {
    name: "Esencial",
    price: "497",
    badge: null,
    accent: "#2dd4bf",
    featured: false,
    perks: [
      "Acceso a todos los módulos",
      "Proyectos prácticos guiados",
      "Foro de comunidad",
      "Certificado digital avalado",
      "Actualizaciones durante 1 año",
    ],
    cta: "Empezar ahora",
  },
  {
    name: "Pro",
    price: "997",
    badge: "MÁS POPULAR",
    accent: "#818cf8",
    featured: true,
    perks: [
      "Todo lo del plan Esencial",
      "Sesiones en vivo semanales",
      "Mentorías grupales con expertos",
      "Code review 1:1 mensual",
      "Acceso de por vida al contenido",
      "Bolsa de empleo exclusiva IA",
    ],
    cta: "Unirme al Pro",
  },
  {
    name: "Elite",
    price: "1.997",
    badge: null,
    accent: "#f97316",
    featured: false,
    perks: [
      "Todo lo del plan Pro",
      "Coaching 1:1 quincenal",
      "Revisión de CV y perfil LinkedIn",
      "Acceso anticipado a módulos nuevos",
      "Badge verificado en LinkedIn",
      "Garantía de entrevistas*",
    ],
    cta: "Aplicar al Elite",
  },
];
