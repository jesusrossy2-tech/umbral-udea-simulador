import Link from 'next/link';

export const metadata = { title: 'Política de privacidad — Umbral UdeA' };

export default function PrivacyPage() {
  return <main className="legalShell">
    <nav><Link href="/">← Volver a Umbral UdeA</Link></nav>
    <article>
      <span>ÚLTIMA ACTUALIZACIÓN · 17 DE SEPTIEMBRE DE 2026</span>
      <h1>Política de privacidad</h1>
      <p>Umbral UdeA es un proyecto educativo independiente. Esta política explica cómo tratamos la información cuando utilizas el simulador o eliges sincronizar tu progreso con Google.</p>
      <h2>Datos que tratamos</h2>
      <p>Puedes usar el simulador sin una cuenta. En ese caso, generamos un identificador aleatorio del navegador para asociar tus intentos. Si eliges «Continuar con Google», recibimos de Google tu identificador estable, dirección de correo electrónico verificada, nombre y, cuando está disponible, foto de perfil. No recibimos ni almacenamos tu contraseña de Google.</p>
      <h2>Finalidad</h2>
      <p>Usamos estos datos exclusivamente para autenticarte, vincular y sincronizar tus simulacros, mostrar tu historial, calcular recomendaciones de estudio y proteger el servicio frente a abusos. No vendemos datos personales ni los utilizamos para publicidad.</p>
      <h2>Datos de Google</h2>
      <p>El acceso se limita a los permisos básicos <code>openid</code>, <code>email</code> y <code>profile</code>. No almacenamos tokens de acceso ni de actualización de Google y no accedemos a Gmail, Drive, contactos, calendario ni otros productos de Google.</p>
      <h2>Almacenamiento y seguridad</h2>
      <p>Los perfiles, sesiones e intentos se almacenan en Cloudflare D1. Las sesiones usan cookies seguras, HttpOnly y SameSite; en la base de datos solo se conserva un hash del token de sesión. Las sesiones vencen a los 30 días.</p>
      <h2>Conservación y control</h2>
      <p>Conservamos el perfil y el historial mientras la cuenta se utilice o hasta que solicites su eliminación. Desde «Mi progreso» puedes borrar el historial. También puedes cerrar sesión o revocar el acceso desde tu Cuenta de Google.</p>
      <h2>Proveedores y divulgación</h2>
      <p>Google presta el servicio de identidad y Cloudflare aloja la aplicación y su base de datos. Solo compartimos con estos proveedores la información necesaria para operar el servicio o cuando exista una obligación legal.</p>
      <h2>Tus derechos y contacto</h2>
      <p>Puedes solicitar acceso, corrección o eliminación de tus datos escribiendo a <a href="mailto:jesusrossy2@gmail.com">jesusrossy2@gmail.com</a>. También puedes usar este correo para preguntas sobre privacidad o consentimiento.</p>
      <h2>Cambios</h2>
      <p>Si esta política cambia, actualizaremos la fecha indicada al inicio. Los cambios sustanciales se comunicarán dentro del servicio cuando sea razonablemente posible.</p>
    </article>
  </main>;
}
