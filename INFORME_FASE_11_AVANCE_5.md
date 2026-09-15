# Fase 11 correctiva — avance 5

## Resultado

Se reconstruyó y habilitó el examen histórico **UdeA 2019-2 J1** como un simulacro completo y fiel de 80 preguntas: 40 de Competencia Lectora y 40 de Razonamiento Lógico.

La reconstrucción se hizo contra el documento completo renderizado, no a partir de la segmentación automática del ZIP complementario. El ZIP se conservó únicamente como fuente de contraste.

## Reparaciones realizadas

- Se restituyeron las preguntas ausentes 27, 46, 56, 62, 63 y 67.
- Se repararon enunciados fragmentados o desplazados, especialmente las preguntas 25-27, 46, 50, 53, 56, 62-63, 67, 70-73 y 76-80.
- Se corrigió la separación errónea de la pregunta 70 y el desplazamiento posterior de la secuencia.
- Se incorporaron los dos textos completos de Competencia Lectora y se enlazaron a las 40 preguntas correspondientes.
- Se incorporaron siete estímulos textuales compartidos de Razonamiento Lógico.
- Se enlazaron los recursos visuales requeridos por 15 preguntas; la 79 conserva además sus dos símbolos individuales.
- Se asignó la clave oficial de 80 respuestas transcrita visualmente desde la imagen incluida en el paquete fuente.

## Estado verificable del banco

- Registros totales: **473**
- Preguntas oficiales verificadas: **357**
- Competencia Lectora verificadas: **160**
- Razonamiento Lógico verificadas: **197**
- Preguntas verificadas con material visual: **64**
- Preguntas de lectura verificadas con texto fuente enlazado: **160**
- Fuentes históricas con preguntas elegibles: **5**
- Exámenes históricos completos disponibles: **4**
  - UDEA_2017_1_J1
  - UDEA_2017_2_J1
  - UDEA_2018_1_J2
  - UDEA_2019_2_J1
- Pendientes de revisión: **101**
- Incompletas: **15**

## Comprobaciones ejecutadas

- Validador estructural del banco: aprobado.
- Secuencia 1-80 y contrato 40 CL + 40 RL: aprobado.
- Coincidencia con la clave transcrita de 80 respuestas: aprobada.
- API del modo histórico: devuelve 80 preguntas, 180 minutos y una sola fuente.
- Material de apoyo: 54 preguntas con texto enlazado y 15 con recurso visual.
- Todos los archivos visuales del examen responden correctamente en el servidor local.
- La API no expone la respuesta correcta ni la ruta de la clave al estudiante.
- Compilación de producción: aprobada.
- Lint: 0 errores; permanecen 6 advertencias preexistentes.

## Archivos principales

- `scripts/repair_2019_2_j1_phase11.mjs`: reparación reproducible e idempotente.
- `scripts/validate_phase11_bank.mjs`: contrato de validación ampliado al examen 2019-2 J1.
- `data/question_bank.json`: 80 registros reconstruidos y habilitados.
- `data/text_resources.json`: textos de lectura y estímulos lógicos compartidos.

## Siguiente frente de trabajo

La fase 11 continúa con las 116 preguntas todavía bloqueadas (101 en revisión y 15 incompletas). La siguiente prioridad es reconstruir otro bloque histórico completo a partir de las fuentes renderizadas, manteniendo el mismo criterio de literalidad, clave confirmada y material de apoyo completo.
