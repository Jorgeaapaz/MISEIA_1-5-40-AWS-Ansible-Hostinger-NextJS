export interface Module {
  num: string;
  title: string;
  weeks: string;
  color: string;
  topics: string[];
}

export const MODULES: Module[] = [
  {
    num: "01",
    title: "Fundamentos de Machine Learning",
    weeks: "4 semanas · 24 horas",
    color: "#2dd4bf",
    topics: [
      "Álgebra lineal y estadística aplicada para ML",
      "Regresión, clasificación y clustering desde cero",
      "Evaluación, validación cruzada y métricas de negocio",
      "Feature engineering y pipelines de datos",
    ],
  },
  {
    num: "02",
    title: "Deep Learning y Redes Neuronales",
    weeks: "5 semanas · 30 horas",
    color: "#818cf8",
    topics: [
      "Perceptrones, capas densas y funciones de activación",
      "Backpropagation y optimizadores (Adam, AdamW, SGD)",
      "CNN, RNN, LSTM y arquitecturas Transformer",
      "PyTorch avanzado: entrenamiento distribuido a escala",
    ],
  },
  {
    num: "03",
    title: "NLP y Grandes Modelos de Lenguaje",
    weeks: "4 semanas · 24 horas",
    color: "#f97316",
    topics: [
      "Embeddings y representación semántica del lenguaje",
      "Fine-tuning eficiente de GPT, BERT y Llama (LoRA/QLoRA)",
      "Ingeniería de prompts avanzada y LLM chains",
      "RAG, agentes autónomos y aplicaciones empresariales",
    ],
  },
  {
    num: "04",
    title: "Computer Vision",
    weeks: "3 semanas · 18 horas",
    color: "#ec4899",
    topics: [
      "Detección y segmentación de objetos (YOLO v9, SAM 2)",
      "Modelos generativos: GANs y Diffusion Models",
      "Visión en tiempo real y edge AI en dispositivos",
      "Casos de uso médicos, industriales y de seguridad",
    ],
  },
  {
    num: "05",
    title: "MLOps y Modelos en Producción",
    weeks: "3 semanas · 18 horas",
    color: "#34d399",
    topics: [
      "Pipelines CI/CD para proyectos de ML (GitHub Actions)",
      "Monitorización de drift de datos y degradación de modelos",
      "Docker, Kubernetes y plataformas cloud ML (AWS SageMaker)",
      "MLflow, DVC y gestión de experimentos a escala",
    ],
  },
  {
    num: "06",
    title: "Proyecto Final con Mentores",
    weeks: "3 semanas · 15 horas",
    color: "#fbbf24",
    topics: [
      "Definición y scoping de un problema real de negocio",
      "Diseño de arquitectura e implementación completa",
      "Evaluación, despliegue y monitorización en producción",
      "Presentación ante panel de expertos del sector tecnológico",
    ],
  },
];
