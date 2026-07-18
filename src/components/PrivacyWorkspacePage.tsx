import type { ReactNode } from 'react';
import PrivacyPolicyLayout, {
  type PolicyHighlight,
  type PolicySection,
} from './PrivacyPolicyLayout';

const LAST_UPDATED = '15 de julio de 2026';
const CONTACT_EMAIL = 'contacto@tricode.studio';

function FingerprintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M12 11.2a2.8 2.8 0 0 1 2.8 2.8v.9a6 6 0 0 1-1 3.3M7.8 19.4A8.8 8.8 0 0 1 6.4 14v-1a5.6 5.6 0 0 1 10-3.4M6 8a9 9 0 0 1 12.9.2M4.3 6a11 11 0 0 1 15.8.3M12 11v3.6M9.4 11.3V15a7 7 0 0 0 1.1 3.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 11V7.5a4 4 0 1 1 8 0V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <path
        d="M12 3.2 19 6v5c0 4.6-3 8.2-7 10-4-1.8-7-5.4-7-10V6l7-2.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HIGHLIGHTS: PolicyHighlight[] = [
  { icon: ShieldIcon, label: 'Uso exclusivo del equipo interno de Tricode' },
  { icon: FingerprintIcon, label: 'La biometría se procesa 100% en tu dispositivo' },
  { icon: LockIcon, label: 'Contraseñas cifradas, todo viaja por HTTPS' },
];

// ReactNode se sigue usando en los `body` de cada sección.
type Section = PolicySection & { body: ReactNode };

const SECTIONS: Section[] = [
  {
    number: '01',
    title: 'Responsable del tratamiento',
    body: (
      <p>
        Esta política aplica a <strong className="text-white">Tricode Workspace</strong>, la app
        Android publicada por Tricode Studio (Trinidad, Flores, Uruguay), y a la plataforma web que
        esa app utiliza (<span className="text-white/85">workspace.tricode.studio</span>). Para
        cualquier consulta sobre tus datos, escribinos a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white/60">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
  {
    number: '02',
    title: 'Alcance de la app',
    body: (
      <p>
        Tricode Workspace es una herramienta de uso exclusivamente interno: la usa el equipo de
        Tricode para gestionar su propio trabajo como agencia (tareas, prospección comercial,
        finanzas internas, bandeja de correo compartida). No es un producto para clientes ni para el
        público general — no existe registro público, las cuentas las crea y aprueba un
        administrador de Tricode, y no está dirigida a menores de edad.
      </p>
    ),
  },
  {
    number: '03',
    title: 'Qué datos recopilamos',
    body: (
      <ul className="grid gap-3">
        <li>
          <strong className="text-white/90">Datos de cuenta:</strong> nombre, email, teléfono y foto
          de perfil (estos dos últimos opcionales) del staff de Tricode.
        </li>
        <li>
          <strong className="text-white/90">Datos operativos internos de Tricode</strong>: tareas y
          proyectos propios, prospección comercial (leads de la agencia, no datos de clientes
          finales), movimientos financieros internos, notas, y el contenido de la bandeja de correo
          compartida del equipo.
        </li>
        <li>
          <strong className="text-white/90">Token de notificaciones push</strong> de tu dispositivo
          (vía Firebase Cloud Messaging), usado únicamente para avisos de actividad interna (tareas
          asignadas, nuevos prospectos, correos nuevos, etc.).
        </li>
        <li>
          <strong className="text-white/90">Datos técnicos de sesión:</strong> cookies de
          autenticación, dirección IP y user-agent, usados para mantener tu sesión activa y por
          seguridad (detección de accesos anómalos, auditoría de cambios).
        </li>
      </ul>
    ),
  },
  {
    number: '04',
    title: 'Biometría: se queda en tu teléfono',
    accent: true,
    accentBadge: (
      <>
        <FingerprintIcon />
        100% local
      </>
    ),
    body: (
      <p>
        El desbloqueo con huella digital o reconocimiento facial que ofrece la app se procesa
        enteramente en tu dispositivo, a través de las APIs de seguridad de Android. Tricode nunca
        recibe, transmite ni almacena datos biométricos: es una capa de bloqueo local adicional sobre
        una sesión que ya iniciaste normalmente con tu usuario y contraseña.
      </p>
    ),
  },
  {
    number: '05',
    title: 'Cómo usamos estos datos',
    body: (
      <p>
        Solo para operar la herramienta interna: autenticar tu acceso, enviarte notificaciones de
        actividad relevante, y mantener la seguridad e integridad del servicio. No usamos estos datos
        con fines publicitarios, no los vendemos, y no los compartimos con clientes ni terceros ajenos
        a Tricode.
      </p>
    ),
  },
  {
    number: '06',
    title: 'Con quién compartimos datos',
    body: (
      <ul className="grid gap-3">
        <li>
          <strong className="text-white/90">Firebase Cloud Messaging (Google)</strong>, para la
          entrega de notificaciones push.
        </li>
        <li>
          <strong className="text-white/90">Proveedores de infraestructura</strong> donde corre la
          plataforma (hosting).
        </li>
      </ul>
    ),
  },
  {
    number: '07',
    title: 'Seguridad',
    body: (
      <p>
        Las contraseñas se almacenan cifradas (nunca en texto plano), toda la comunicación viaja por
        HTTPS, se mantiene un registro de auditoría de cambios, y las cuentas de mayor privilegio
        requieren un segundo factor de autenticación.
      </p>
    ),
  },
  {
    number: '08',
    title: 'Retención y eliminación',
    body: (
      <p>
        Conservamos los datos mientras la cuenta del staff esté activa. Un miembro del equipo puede
        solicitar la eliminación de su cuenta o de datos puntuales escribiendo a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white/60">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
  {
    number: '09',
    title: 'Tus derechos',
    body: (
      <p>
        Cualquier miembro del equipo puede solicitar acceso, corrección o eliminación de sus datos
        personales en cualquier momento, escribiendo a{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline decoration-white/25 underline-offset-4 hover:decoration-white/60">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    ),
  },
  {
    number: '10',
    title: 'Cambios a esta política',
    body: (
      <p>
        Podemos actualizar este documento con el tiempo; la fecha de la última actualización figura
        al pie de esta página.
      </p>
    ),
  },
];

export default function PrivacyWorkspacePage() {
  return (
    <PrivacyPolicyLayout
      titleLead="Cómo tratamos los"
      titleKeyword="datos"
      titleTail="en Tricode Workspace."
      intro="Tricode Workspace es una herramienta de uso interno del equipo de Tricode. Esta página describe qué información recopila la app para Android y la plataforma que la acompaña."
      appLabel="Tricode Workspace · Android + workspace.tricode.studio"
      lastUpdated={LAST_UPDATED}
      contactEmail={CONTACT_EMAIL}
      highlights={HIGHLIGHTS}
      sections={SECTIONS}
    />
  );
}
