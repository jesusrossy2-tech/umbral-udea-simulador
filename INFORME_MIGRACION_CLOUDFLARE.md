# Migración independiente a Cloudflare

Fecha: 16 de septiembre de 2026

## Resultado

El simulador se despliega directamente en Cloudflare Workers, sin depender del dominio de ChatGPT Sites.

- URL principal: <https://umbral-udea.jesusrossy2.workers.dev>
- Worker: `umbral-udea`
- Base de datos D1: `umbral-udea-db`
- Enlace anterior: se conserva temporalmente como respaldo; no fue eliminado ni modificado.
- Plan: recursos gratuitos de Cloudflare, sujeto a los límites vigentes del plan gratuito.

## Despliegue reproducible

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm run cf:db:migrate
pnpm run cf:deploy:check
pnpm run cf:deploy
```

La configuración independiente se encuentra en `wrangler.cloudflare.jsonc`. Las migraciones de D1 están en `drizzle/`.

## Persistencia

La base D1 de Cloudflare es independiente de la base administrada por ChatGPT Sites. Los nuevos intentos y simulaciones se guardan en `umbral-udea-db`. El banco de preguntas y sus recursos visuales forman parte del despliegue y no dependen de la base anterior.

La autenticación opcional con Google permite sincronizar el historial entre dispositivos. La arquitectura y las medidas de seguridad están documentadas en `INFORME_AUTENTICACION_GOOGLE.md`.

## Dominio

`workers.dev` y HTTPS se suministran sin comprar un dominio. Un dominio propio como `.com` puede añadirse posteriormente, pero su registro no es gratuito.
