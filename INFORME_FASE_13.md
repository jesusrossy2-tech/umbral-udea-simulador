# Fase 13 — endurecimiento de seguridad

## Primer bloque completado

Esta fase reduce la exposición de las claves y el abuso de la API sin cambiar la experiencia normal del estudiante.

### Protección de respuestas

- La entrega ya no devuelve `correctAnswer` ni el detalle completo de cada respuesta.
- Los nuevos intentos guardan únicamente ID de pregunta, sección, tema y resultado (`correct`, `incorrect` u `omitted`).
- Las respuestas elegidas y la clave correcta dejaron de persistirse en los nuevos registros de historial.
- Las respuestas iniciales y finales de la API se marcan como `no-store` para evitar cachés intermedias.

### Control de abuso

- Cada identificador de estudiante puede iniciar como máximo 20 sesiones por hora.
- Al superar el límite la API responde 429 e informa un tiempo de espera.
- Las simulaciones sin entregar con más de 24 horas se eliminan cuando ese estudiante vuelve a iniciar una sesión.
- El límite utiliza el índice existente por estudiante y fecha; no requiere guardar dirección IP ni datos personales adicionales.

### Tiempo autoritativo

- La duración utilizada para calificar se calcula desde `started_at` en el servidor.
- Un cliente modificado ya no puede declarar libremente un tiempo inferior al transcurrido.
- El servidor marca como agotado cualquier intento entregado después de la duración configurada.

## Controles superados

- Construcción de producción.
- Validador del banco de 437 preguntas elegibles.
- Cinco exámenes históricos completos.
- Ruta administrativa cerrada.
- Claves ausentes en la respuesta inicial y en la respuesta de entrega.
- Límite de sesiones y temporización del servidor presentes.

## Pendientes que requieren una decisión de operación

1. El repositorio de GitHub continúa público y contiene el banco con claves. Debe decidirse entre volverlo privado o publicar una edición separada sin banco ni claves.
2. Sites conserva la base D1 operativa, pero todavía hace falta definir dónde guardar exportaciones cifradas y durante cuánto tiempo conservarlas.
3. Una protección por identificador reduce abuso casual, pero no sustituye un rate limit de infraestructura cuando aumente la audiencia.

