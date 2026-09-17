# Autenticación y sincronización con Google

Fecha: 17 de septiembre de 2026

## Estado

La integración está implementada y desplegada en Cloudflare Workers con Google OpenID Connect.

- Proyecto de Google Cloud: `Umbral UdeA`
- ID del proyecto: `regal-creek-508904-k7`
- Cliente: aplicación web `Umbral UdeA Web`
- Origen autorizado: `https://umbral-udea.jesusrossy2.workers.dev`
- Redirección autorizada: `https://umbral-udea.jesusrossy2.workers.dev/api/auth/google/callback`
- Política de privacidad: `https://umbral-udea.jesusrossy2.workers.dev/privacidad`
- Condiciones del servicio: `https://umbral-udea.jesusrossy2.workers.dev/terminos`
- Datos solicitados a Google: identificador estable, correo verificado, nombre y foto.
- No se almacenan contraseñas de Google, tokens de acceso ni tokens de actualización.

## Flujo de seguridad

1. El servidor genera `state`, `nonce` y un verificador PKCE criptográficamente aleatorios.
2. Google autentica al usuario y devuelve un código de autorización al URI registrado.
3. El servidor canjea el código y verifica firma, emisor, audiencia, expiración y `nonce` del ID token.
4. Se crea una sesión opaca de 30 días. En D1 solo se almacena el hash SHA-256 del token.
5. La cookie usa `HttpOnly`, `Secure`, `SameSite=Lax` y el prefijo `__Host-`.
6. Las operaciones mutables comprueban que el encabezado `Origin` coincida con el origen público.

## Sincronización

Al iniciar sesión por primera vez, el historial anónimo del navegador se vincula con la cuenta. Después, simulacros, entregas, historial y recomendaciones usan el identificador interno de la cuenta y quedan disponibles al volver a iniciar sesión en otro dispositivo.

El sistema conserva el modo anónimo: iniciar sesión es opcional.

## Validación en producción

- El inicio de sesión con la cuenta de prueba finalizó correctamente.
- La interfaz mostró el nombre, correo y el estado «progreso sincronizado».
- La sesión permaneció activa al recargar el sitio.
- Los endpoints de inicio, sesión, privacidad y condiciones respondieron con estado HTTP 200.
- La redirección OAuth utiliza `state`, `nonce` y PKCE S256, con respuestas sin caché.

## Persistencia

La migración `drizzle/0002_google_auth.sql` añade:

- `users`: identidad de Google y perfil básico.
- `sessions`: hash de sesión, usuario, creación y vencimiento.

Las credenciales `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` se administran mediante secretos cifrados de Cloudflare y no se incluyen en el repositorio ni en los archivos de respaldo.

## Comandos de mantenimiento

```bash
pnpm exec wrangler secret put GOOGLE_CLIENT_ID --config wrangler.cloudflare.jsonc
pnpm exec wrangler secret put GOOGLE_CLIENT_SECRET --config wrangler.cloudflare.jsonc
pnpm run cf:db:migrate
pnpm run cf:deploy
```

Si se rota el secreto en Google Cloud, se actualiza `GOOGLE_CLIENT_SECRET` con el segundo comando y se vuelve a probar el acceso.
