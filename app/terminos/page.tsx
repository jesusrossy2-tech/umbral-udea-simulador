import Link from 'next/link';

export const metadata = { title: 'Condiciones del servicio — Umbral UdeA' };

export default function TermsPage() {
  return <main className="legalShell">
    <nav><Link href="/">← Volver a Umbral UdeA</Link></nav>
    <article>
      <span>ÚLTIMA ACTUALIZACIÓN · 17 DE SEPTIEMBRE DE 2026</span>
      <h1>Condiciones del servicio</h1>
      <p>Al utilizar Umbral UdeA aceptas estas condiciones. El servicio es una herramienta educativa independiente y no pertenece, representa ni sustituye a la Universidad de Antioquia.</p>
      <h2>Uso del servicio</h2>
      <p>Puedes practicar de forma anónima o iniciar sesión con Google para sincronizar tu progreso. Debes usar el servicio con fines lícitos y abstenerte de interferir con su funcionamiento, automatizar solicitudes abusivas o intentar acceder a datos de otras personas.</p>
      <h2>Contenido educativo</h2>
      <p>El banco se construye a partir de material histórico y recursos documentados. Aunque procuramos fidelidad y revisión, el contenido puede contener errores y no garantiza resultados en un proceso de admisión real. Las calificaciones del simulador no son resultados oficiales.</p>
      <h2>Disponibilidad</h2>
      <p>El servicio se ofrece sin garantía de disponibilidad ininterrumpida. Podemos realizar mantenimiento, corregir preguntas o modificar funciones para mejorar la seguridad y la calidad educativa.</p>
      <h2>Cuenta y datos</h2>
      <p>El inicio de sesión es opcional. El tratamiento de la información se describe en la <Link href="/privacidad">Política de privacidad</Link>. Puedes cerrar sesión, borrar tu historial o solicitar la eliminación de tu perfil.</p>
      <h2>Contacto</h2>
      <p>Para consultas sobre estas condiciones escribe a <a href="mailto:jesusrossy2@gmail.com">jesusrossy2@gmail.com</a>.</p>
    </article>
  </main>;
}
