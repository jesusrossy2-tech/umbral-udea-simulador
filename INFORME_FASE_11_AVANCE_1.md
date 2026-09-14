# Fase 11 correctiva — Avance 1

## Estado

La orden correctiva está en ejecución. Este avance completa la auditoría integral del ZIP e incorpora al producto las correcciones que ya cuentan con evidencia suficiente. La fase 11 no se declara terminada porque todavía falta extraer y verificar pregunta por pregunta todas las administraciones UdeA confirmadas del corpus.

## Auditoría del corpus

- 274 entradas verificadas en el ZIP: 268 archivos y 6 directorios.
- Los 268 archivos tienen clasificación individual y evidencia registrada.
- Unicauca, Universidad de Cartagena, Formarte y otros preuniversitarios quedan excluidos del banco histórico oficial.
- Se identificaron 23 administraciones UdeA en el registro de auditoría: 13 con alguna clave asociada y 10 sin clave confirmada.

## Banco corregido integrado

- 464 registros procedentes de seis exámenes UdeA procesados.
- 185 preguntas elegibles bajo los nuevos controles.
- 119 preguntas CL y 66 preguntas RL elegibles.
- Tres fuentes históricas UdeA con clave participan en el banco elegible.
- 185 preguntas tienen coincidencia con texto fuente, página localizada, respuesta confirmada y literalidad `verified`.
- 279 registros permanecen en `needs_review` o `incomplete` y están bloqueados.
- El porcentaje `unclassified` del subconjunto elegible bajó de 28,2 % a 0 % mediante revisión semántica auditable.

## Motor corregido

- Cada simulacro completo selecciona 80 preguntas: 40 CL y 40 RL.
- La selección estratifica por la distribución temática del banco elegible.
- Se exige participación de más de un examen histórico.
- El historial de preguntas vistas prioriza preguntas nuevas sin romper el contrato 40+40.
- Cada simulacro queda persistido antes de enviarse al navegador.
- La calificación usa exclusivamente las preguntas de esa sesión.

## Modos y administración

- `Simulacro completo`: funcional con combinación multi-examen.
- `Práctica personalizada`: funcional por sección, tema y cantidad.
- `Recrear examen histórico`: interfaz y motor implementados, pero ningún examen se habilita todavía porque ninguno alcanza 80 preguntas verificadas individualmente. El bloqueo es deliberado y evita completar exámenes con preguntas dudosas.
- Panel administrativo: consulta trazabilidad, fuente, página, confianza, literalidad y estado; permite marcar `verified`, `needs_review`, `incomplete` o `excluded`.
- Las revisiones administrativas no verificadas se excluyen inmediatamente de nuevas selecciones.

## Pendiente obligatorio

1. Extraer las administraciones UdeA restantes, incluidas las fuentes PDF y DOC heredadas.
2. Verificar literalmente enunciados, opciones y recursos visuales de esas administraciones.
3. Vincular y revisar más claves para ampliar la elegibilidad.
4. Conseguir al menos una administración completa de 80 preguntas verificadas para habilitar el modo histórico.
5. Revalidar la distribución temática con el banco ampliado.

Hasta completar esos puntos no debe afirmarse que la fase 11 satisface todo su criterio de aceptación.
