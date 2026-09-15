# Fase 8 de 10 — Interfaz web

## Estado

La fase 8 está **completada, compilada y publicada de forma privada**.

Sitio: <https://umbral-udea-simulador.ciovonhorst.chatgpt.site>

## Interfaz entregada

- Portada específica del simulador UdeA.
- Condiciones visibles: 80 preguntas, distribución 40+40 y 180 minutos.
- Simulacro reproducible con preguntas históricas.
- Temporizador descendente desde `03:00:00` y entrega automática al llegar a cero.
- Navegador de 80 preguntas con estados actual, respondida y pendiente.
- Separación entre Competencia Lectora y Razonamiento Lógico.
- Selección y cambio de respuestas A–D, navegación anterior/siguiente y entrega manual.
- Presentación de estímulos e imágenes de opciones cuando existen.
- Resultados con correctas, incorrectas, omitidas, porcentaje, tiempo y desglose CL/RL.
- Aviso explícito de que el puntaje estandarizado no está disponible.
- Diseño adaptable para escritorio y móvil.

## Protección de respuestas

Las respuestas correctas permanecen en el servidor. `GET /api/exam` elimina `correct_answer` antes de enviar las preguntas al navegador; `POST /api/exam` realiza la calificación al entregar.

## Datos integrados

- 40 preguntas históricas de Competencia Lectora.
- 40 preguntas históricas de Razonamiento Lógico.
- Recursos gráficos asociados.
- Claves verificadas usadas únicamente en servidor.

## Validación y publicación

- Se autorizaron los scripts de instalación solicitados (`esbuild`, `sharp`, `unrs-resolver` y `workerd`).
- El conjunto contiene exactamente 80 preguntas, distribuidas 40+40.
- TypeScript finalizó sin errores con `tsc --noEmit`.
- La compilación de producción terminó correctamente.
- Las respuestas no aparecen en el estado del cliente ni en la respuesta pública del endpoint.
- Se creó y desplegó una versión privada del sitio.

El entorno aislado impidió abrir un servidor local por restricciones de enlace de puertos. La compilación de producción y el despliegue se completaron correctamente; la comprobación final se realiza sobre la URL privada publicada.

## Siguiente fase

La **Fase 9: historial y evolución del estudiante** añadirá persistencia de intentos, consulta de resultados anteriores y métricas de progreso.
