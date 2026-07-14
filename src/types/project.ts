export type ProjectMetric = {
  label: string;
  value: string;
};

export type ProjectTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  short: string;
  long: string;
  image: string;
  gallery: string[];
  tags: string[];
  url?: string;
  year: string;
  accent: string;
  featured: boolean;
  // Case study narrativo -- todos opcionales; si no hay problema/enfoque
  // cargados, ProjectDetailPage cae a `long` como cuerpo genérico.
  problem: string;
  approach: string;
  result: string;
  metrics: ProjectMetric[];
  testimonial: ProjectTestimonial | null;
};
