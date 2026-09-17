# Auditoría final de fidelidad del banco de preguntas

**Fecha:** 17 de septiembre de 2026

**Resultado:** aprobado con exclusiones documentadas

**Fuente contrastada:** documentos históricos incluidos en el paquete del Drive y el ZIP complementario `banco_preguntas_udea_simulacro.zip`.

## Resultado de cierre

El banco queda con **477 registros históricos**:

- **437 preguntas elegibles y verificadas**.
- **5 exámenes históricos completos** de 80 preguntas: 2017-1 J1, 2017-2 J1, 2018-1 J2, 2019-1 J1 y 2019-2 J1.
- **37 preguntas verificadas** de Razonamiento Lógico de 2018-1 J3, correspondientes a la secuencia existente 41-77.
- **40 preguntas literales de Competencia Lectora de 2018-1 J3**, conservadas con sus textos y opciones, pero excluidas del simulador porque la clave entregada no contiene sus respuestas.
- **0 registros pendientes de revisión**.
- **0 registros incompletos**.

## Correcciones realizadas

La revisión visual del documento renderizado de 2018-1 J3 identificó que la extracción anterior había omitido tres preguntas:

1. Pregunta 5: `El término afinar (párrafo 1)...`.
2. Pregunta 24: `En el texto se expresa que “somos un país lleno de merengues”...`.
3. Pregunta 39: `Una diferencia fundamental entre ambos textos es que...`.

Estas omisiones desplazaban la numeración de las preguntas 6-23 y 25-38. Se reconstruyó la secuencia completa 1-40 con los identificadores correctos, cuatro opciones por pregunta, localización de página y enlaces a los dos textos fuente.

También se agregaron los recursos completos:

- `UDEA_2018_1_J3_CL_TEXT_1`: *Hacemos cosas con palabras, según Austin*.
- `UDEA_2018_1_J3_CL_TEXT_2`: *Diatriba contra el incumplimiento*.

## Decisión sobre la clave 2018-1 J3

La imagen `Screenshot_20200318-225258.png` fue inspeccionada visualmente y verificada por SHA-256. Contiene respuestas únicamente para Razonamiento Lógico 41-77. La columna de Competencia Lectora 1-40 está vacía y las posiciones 78-80 también están vacías; además, esas tres preguntas no aparecen en el documento fuente.

Por integridad académica:

- no se inventaron respuestas para Competencia Lectora;
- no se fabricaron las preguntas 78-80;
- las preguntas lectoras se clasificaron como `excluded`, no como pendientes ni elegibles;
- el simulador continúa utilizando únicamente preguntas con respuesta comprobada.

## Comparación documental

Se comprobaron los hashes SHA-256 de los seis documentos fuente. Los seis coinciden con las copias auditadas.

De los 477 registros:

- **369** presentan coincidencia directa completa del enunciado y sus cuatro opciones en el texto extraído del documento.
- **108** corresponden a fórmulas, gráficos, tablas, diagramas o reconstrucciones donde la extracción lineal del DOCX no conserva el contenido; estos casos mantienen localización de página y verificación manual/renderizada.

El detalle por fuente, los hashes y los conteos de coincidencia se encuentran en `artifacts/audit/final_question_fidelity_audit.json`.

## Controles automáticos superados

- Identificadores únicos.
- Cuatro opciones completas en toda pregunta utilizable.
- Claves limitadas a A-D y contrastadas con las transcripciones verificadas.
- Continuidad 1-80 y distribución 40 CL + 40 RL en los cinco simulacros históricos completos.
- Existencia de todos los recursos visuales referenciados.
- Texto fuente enlazado para las 200 preguntas de Competencia Lectora elegibles.
- Texto fuente enlazado para las 40 preguntas lectoras excluidas de 2018-1 J3.
- Ausencia de registros `needs_review` o `incomplete`.
- Exclusión obligatoria de toda pregunta sin clave comprobada.

## Conclusión

El banco queda cerrado bajo un criterio verificable: se habilita solamente aquello que puede demostrarse con el documento y su clave; el material literal sin respuesta confirmada se conserva, pero no participa en la calificación. Con estas correcciones, el sistema no presenta preguntas incompletas ni pendientes y puede considerarse terminado en cuanto a integridad del banco disponible.
