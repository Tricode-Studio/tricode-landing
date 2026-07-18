import type { ReactNode } from 'react';
import PrivacyPolicyLayout, {
  type PolicyHighlight,
  type PolicySection,
} from './PrivacyPolicyLayout';

const LAST_UPDATED = '15 de julio de 2026';
const CONTACT_EMAIL = 'contacto@tricode.studio';

function NoSaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.2 7.2l9.6 9.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

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
  { icon: NoSaleIcon, label: 'Nunca vendemos tus datos a terceros' },
  { icon: FingerprintIcon, label: 'La biometría se procesa 100% en tu dispositivo' },
  { icon: LockIcon, label: 'Contraseñas cifradas, todo viaja por HTTPS' },
  { icon: ShieldIcon, label: 'Sin registro público: solo cuentas aprobadas' },
];

// ReactNode se sigue usando en los `body` de cada sección.
type Section = PolicySection & { body: ReactNode };

const SECTIONS: Section[] = [
  {
    number: '01',
    title: 'Responsable del tratamiento',
    body: (
      <p>
        Esta política aplica a <strong className="text-white">Tricode CMS</strong>, la app Android
        publicada por Tricode Studio (Trinidad, Flores, Uruguay), y a la plataforma web que esa app
        utiliza (<span className="text-white/85">cms.tricode.studio</span>). Para cualquier consulta
        sobre tus datos, escribinos a{' '}
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
        Tricode CMS es una herramienta de uso profesional: la usan personas que ya tienen una cuenta
        creada y aprobada por un administrador dentro de su organización. No existe registro público
        ni alta de cuentas por auto-servicio, y no está dirigida a consumidores finales ni a menores
        de edad.
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
          de perfil (estos dos últimos opcionales).
        </li>
        <li>
          <strong className="text-white/90">Datos operativos del negocio</strong> que tu organización
          gestiona desde la plataforma — clientes, reservas, tareas, notas, movimientos financieros,
          proyectos — que varían según el rubro y lo que cada organización decide cargar.
        </li>
        <li>
          <strong className="text-white/90">Token de notificaciones push</strong> de tu dispositivo
          (vía Firebase Cloud Messaging), usado únicamente para enviarte avisos de actividad relevante
          dentro de tu organización (tareas asignadas, nuevas reservas, etc.).
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
    title: 'Cómo usamos tus datos',
    body: (
      <p>
        Usamos tus datos para operar la plataforma, autenticar tu acceso, enviarte notificaciones
        relevantes, darte soporte y mantener la seguridad e integridad del servicio. No usamos tus
        datos con fines publicitarios ni los vendemos a terceros.
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
        <li>
          <strong className="text-white/90">Servicio de email transaccional</strong>, para el envío
          de credenciales de acceso y avisos por correo.
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
        HTTPS, los datos de cada organización están aislados entre sí, se mantiene un registro de
        auditoría de cambios, y las cuentas de mayor privilegio requieren un segundo factor de
        autenticación.
      </p>
    ),
  },
  {
    number: '08',
    title: 'Retención y eliminación',
    body: (
      <p>
        Conservamos los datos mientras tu cuenta esté activa y tu organización utilice la plataforma.
        Podés solicitar la eliminación de tu cuenta o de datos puntuales escribiendo a{' '}
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
        Podés solicitar acceso, corrección o eliminación de tus datos personales en cualquier
        momento, escribiéndonos a{' '}
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
        al pie de esta página. Los cambios importantes se comunican a los administradores de cada
        organización.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <PrivacyPolicyLayout
      titleLead="Cómo tratamos tus"
      titleKeyword="datos"
      titleTail="en Tricode CMS."
      intro="Esta página describe qué información recopila la app Tricode CMS para Android y la plataforma que la acompaña, y qué hacemos (y qué no hacemos) con ella."
      appLabel="Tricode CMS · Android + cms.tricode.studio"
      lastUpdated={LAST_UPDATED}
      contactEmail={CONTACT_EMAIL}
      highlights={HIGHLIGHTS}
      sections={SECTIONS}
    />
  );
}
