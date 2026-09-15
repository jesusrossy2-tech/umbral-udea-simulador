# Fase 9 de 10 — Historial y evolución

## Estado

La fase 9 está implementada y preparada para publicación sobre el sitio privado de Umbral UdeA.

## Funcionalidad incorporada

- Guardado automático y duradero de cada simulacro terminado.
- Identificación anónima vinculada al navegador, sin solicitar nombre ni correo.
- Vista «Mi progreso» accesible desde la portada y los resultados.
- Resumen de cantidad de intentos, promedio, mejor resultado y variación reciente.
- Gráfica de respuestas correctas por intento.
- Historial de los 30 intentos más recientes.
- Comparación de Competencia Lectora y Razonamiento Lógico en cada intento.
- Registro del tiempo utilizado y de entregas causadas por tiempo agotado.
- Estados de historial vacío, error de consulta y confirmación de guardado.

## Persistencia

Los resultados se almacenan en la base de datos D1 del sitio. El navegador conserva únicamente un identificador aleatorio que permite recuperar los registros; no contiene las respuestas ni actúa como fuente principal del historial.

La base conserva también el detalle por pregunta para permitir que la fase 10 genere recomendaciones por tema y patrón de error.

## Validación

- Esquema e índice generados mediante migración versionada.
- Índice compuesto para consultar los intentos por estudiante y fecha.
- Identificadores de historial validados antes de cualquier consulta.
- TypeScript sin errores.
- Compilación de producción satisfactoria con las rutas `/`, `/api/exam` y `/api/history`.

## Siguiente fase

La **Fase 10: recomendaciones y cierre** utilizará el historial y el detalle de respuestas para identificar fortalezas, debilidades y prioridades de estudio.
