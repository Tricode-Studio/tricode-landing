import type { Project, ProjectMetric, ProjectTestimonial } from '../types/project';

const configuredApiBaseUrl =
  typeof import.meta.env.VITE_API_BASE_URL === 'string'
    ? import.meta.env.VITE_API_BASE_URL.trim()
    : '';
const API_BASE_URL = configuredApiBaseUrl || 'http://localhost:3000/api/v1';
const TENANT_SLUG =
  typeof import.meta.env.VITE_TENANT_SLUG === 'string' && import.meta.env.VITE_TENANT_SLUG.trim()
    ? import.meta.env.VITE_TENANT_SLUG.trim()
    : '';
const PROJECTS_CONTENT_SLUG =
  typeof import.meta.env.VITE_PROJECTS_CONTENT_SLUG === 'string' &&
  import.meta.env.VITE_PROJECTS_CONTENT_SLUG.trim()
    ? import.meta.env.VITE_PROJECTS_CONTENT_SLUG.trim()
    : 'proyectos';
const DEFAULT_PROJECT_ACCENT = 'from-slate-500/20 to-slate-700/20';

type PublicProjectsResponse = {
  items: Array<{
    id: string;
    title: string | null;
    slug: string | null;
    data?: {
      categoria?: string;
      descripcion?: string;
      short?: string;
      long?: string;
      image?: string;
      gallery?: unknown;
      tags?: unknown;
      stack?: unknown;
      year?: string;
      accent?: string;
      url?: string;
      featured?: boolean;
      position?: number;
      problema?: string;
      enfoque?: string;
      resultado?: string;
      metrics?: unknown;
      testimonio?: unknown;
    };
  }>;
};

export type PublicBudgetFormPayload = {
  nombre: string;
  email?: string;
  telefono?: string;
  empresa?: string;
  rubro?: string;
  tipoProyecto: string;
  objetivo: string;
  rangoPresupuesto?: string;
  plazoDeseado?: string;
  funcionalidades?: string[];
  referencia?: string;
  aceptaContacto?: boolean;
};

export type PublicReservationPayload = {
  serviceName: string;
  startsAt: string;
  endsAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  recurrenceFrequency?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  recurrenceInterval?: number;
  recurrenceCount?: number;
  recurrenceUntil?: string;
  occurrenceOverrides?: Array<{
    index: number;
    startsAt: string;
    endsAt: string;
  }>;
};

export type PublicReservationPreviewPayload = Pick<
  PublicReservationPayload,
  | 'serviceName'
  | 'startsAt'
  | 'endsAt'
  | 'recurrenceFrequency'
  | 'recurrenceInterval'
  | 'recurrenceCount'
  | 'recurrenceUntil'
  | 'occurrenceOverrides'
>;

export type PublicReservationPreview = {
  ok: boolean;
  canCreate: boolean;
  recurrence: {
    frequency: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval: number;
    count: number;
  };
  summary: {
    total: number;
    available: number;
    unavailable: number;
  };
  occurrences: Array<{
    index: number;
    startsAt: string;
    endsAt: string;
    overridden: boolean;
    available: boolean;
    reason: string | null;
    conflict: {
      id: string;
      serviceName: string;
      customerName: string;
      startsAt: string;
    } | null;
    alternatives: Array<{
      startsAt: string;
      endsAt: string;
    }>;
  }>;
};

export type PublicReservationAvailability = {
  tenant: {
    slug: string;
    name: string;
  };
  range: {
    from: string;
    to: string;
  };
  booking: {
    slotMinutes: number;
    maxAdvanceDays: number;
    timezone: string;
    workingDays: Array<{
      day: number;
      enabled: boolean;
      start: string;
      end: string;
    }>;
    workingDayBlocks?: Array<{
      day: number;
      enabled: boolean;
      blocks: Array<{
        start: string;
        end: string;
      }>;
    }>;
    offDates: string[];
    blockedRanges: Array<{
      from: string;
      to: string;
      reason?: string;
    }>;
  };
  busy: Array<{
    startsAt: string;
    endsAt: string;
    recurring: boolean;
  }>;
};

export type PublicPaymentSession = {
  token: string;
  title: string;
  customerName: string | null;
  customerEmail: string;
  currencyId: string;
  oneTimeAmount: number;
  maintenanceAmount: number | null;
  maintenanceFrequencyMonths: number | null;
  status:
    | 'DRAFT'
    | 'CHECKOUT_PENDING'
    | 'ONE_TIME_APPROVED'
    | 'SUBSCRIPTION_PENDING'
    | 'ACTIVE'
    | 'CANCELED'
    | 'EXPIRED'
    | 'FAILED';
  mpPaymentStatus: string | null;
  mpPreapprovalStatus: string | null;
  oneTimePaidAt: string | null;
  subscriptionAuthorizedAt: string | null;
  expiresAt: string | null;
  checkoutInitPoint: string | null;
  subscriptionInitPoint: string | null;
};

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

// Some entries were saved with tags/stack wrapped as `{ items: [...] }`
// instead of a plain array (a bug in the workspace's project editor, fixed
// separately) -- handle both shapes so those existing entries still render.
function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((tag): tag is string => typeof tag === 'string');
  }
  if (value && typeof value === 'object' && Array.isArray((value as { items?: unknown }).items)) {
    return (value as { items: unknown[] }).items.filter(
      (tag): tag is string => typeof tag === 'string',
    );
  }
  return [];
}

function asMetricArray(value: unknown): ProjectMetric[] {
  const source = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && Array.isArray((value as { items?: unknown }).items)
      ? (value as { items: unknown[] }).items
      : [];

  return source
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const label = asString(record.label);
      const metricValue = asString(record.value);
      if (!label && !metricValue) return null;
      return { label, value: metricValue };
    })
    .filter((item): item is ProjectMetric => item !== null);
}

function asTestimonial(value: unknown): ProjectTestimonial | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  const quote = asString(record.quote);
  if (!quote) return null;
  return { quote, author: asString(record.author), role: asString(record.role) };
}

function normalizeProject(
  item: PublicProjectsResponse['items'][number],
  index: number,
): Project {
  const data = item.data ?? {};
  const title = asString(item.title);
  const slug = asString(item.slug) || asString(item.id) || `proyecto-${index + 1}`;

  return {
    slug,
    name: title || slug,
    category: asString(data.categoria),
    short: asString(data.short) || asString(data.descripcion),
    long:
      asString(data.long) ||
      asString(data.descripcion),
    image: asString(data.image),
    gallery: asStringArray(data.gallery),
    tags: asStringArray(data.tags).length ? asStringArray(data.tags) : asStringArray(data.stack),
    url: asString(data.url) || undefined,
    year: asString(data.year),
    accent: asString(data.accent) || DEFAULT_PROJECT_ACCENT,
    featured: data.featured === true,
    problem: asString(data.problema),
    approach: asString(data.enfoque),
    result: asString(data.resultado),
    metrics: asMetricArray(data.metrics),
    testimonial: asTestimonial(data.testimonio),
  };
}

function getTenantSlugOrThrow() {
  if (!TENANT_SLUG) {
    throw new Error(
      'VITE_TENANT_SLUG no está configurado. Definilo para cargar contenido público del espacio.',
    );
  }
  return TENANT_SLUG;
}


export async function fetchCmsProjects() {
  const tenantSlug = getTenantSlugOrThrow();
  const query = new URLSearchParams({ limit: '36' });
  const response = await fetch(
    `${API_BASE_URL}/public/${tenantSlug}/content-types/${PROJECTS_CONTENT_SLUG}/entries?${query.toString()}`,
    {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudieron cargar proyectos (${response.status})`);
  }

  const payload = (await response.json()) as PublicProjectsResponse;
  return payload.items.map((item, index) => normalizeProject(item, index));
}

export async function submitPublicBudgetRequest(payload: PublicBudgetFormPayload) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(`${API_BASE_URL}/public/${tenantSlug}/presupuestos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`No se pudo enviar el formulario (${response.status})`);
  }

  return response.json() as Promise<{ ok: boolean; requestId: string }>;
}

export async function fetchPublicReservationAvailability(from: string, to: string) {
  const tenantSlug = getTenantSlugOrThrow();
  const params = new URLSearchParams({ from, to });
  const response = await fetch(
    `${API_BASE_URL}/public/${tenantSlug}/reservations/availability?${params.toString()}`,
    {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo cargar disponibilidad (${response.status})`);
  }

  return response.json() as Promise<PublicReservationAvailability>;
}

export async function submitPublicReservation(payload: PublicReservationPayload) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(`${API_BASE_URL}/public/${tenantSlug}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`No se pudo crear la reserva (${response.status})`);
  }

  return response.json() as Promise<{
    ok: boolean;
    reservationId: string;
    recurrenceId: string | null;
    recurrenceCreated: number;
    tenant: { slug: string; name: string };
    reservation: {
      serviceName: string;
      startsAt: string;
      endsAt: string;
      status: string;
    };
  }>;
}

export async function previewPublicReservation(payload: PublicReservationPreviewPayload) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(`${API_BASE_URL}/public/${tenantSlug}/reservations/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`No se pudo prevalidar la reserva (${response.status})`);
  }

  return response.json() as Promise<PublicReservationPreview>;
}

export async function fetchPublicPaymentSession(token: string) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(
    `${API_BASE_URL}/public/${tenantSlug}/payments/sessions/${encodeURIComponent(token)}`,
    {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo cargar el link de pago (${response.status})`);
  }

  return response.json() as Promise<PublicPaymentSession>;
}

export async function startPublicCheckout(token: string) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(
    `${API_BASE_URL}/public/${tenantSlug}/payments/sessions/${encodeURIComponent(token)}/checkout`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo iniciar el checkout (${response.status})`);
  }

  return response.json() as Promise<{ initPoint: string; status: string }>;
}

export async function startPublicSubscription(token: string) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(
    `${API_BASE_URL}/public/${tenantSlug}/payments/sessions/${encodeURIComponent(token)}/subscription`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo iniciar la suscripción (${response.status})`);
  }

  return response.json() as Promise<{ initPoint: string; status: string }>;
}

export async function refreshPublicPaymentSession(token: string) {
  const tenantSlug = getTenantSlugOrThrow();
  const response = await fetch(
    `${API_BASE_URL}/public/${tenantSlug}/payments/sessions/${encodeURIComponent(token)}/refresh`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo refrescar el estado del pago (${response.status})`);
  }

  return response.json() as Promise<PublicPaymentSession>;
}
