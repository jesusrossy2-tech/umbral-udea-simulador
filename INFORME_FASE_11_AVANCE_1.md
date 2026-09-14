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

## Avance 2 - verificación de recursos visuales

- Se compararon contra las páginas renderizadas los 24 registros visuales de los tres exámenes que tienen clave confirmada.
- Se verificaron 22 preguntas adicionales; el banco elegible pasó de 185 a 207 preguntas (119 CL y 88 RL).
- Veinte preguntas elegibles ya conservan y muestran recursos visuales revisados.
- Se corrigió la asignación individual de las cuatro figuras de respuesta de la pregunta `UDEA_2017_2_J1_RL_052`.
- Se reconstruyeron desde la fuente las expresiones matemáticas omitidas en `UDEA_2017_2_J1_RL_058` y `UDEA_2017_2_J1_RL_073`.
- Se retiraron asociaciones falsas en las que una imagen pertenecía a una pregunta vecina.
- Dos registros visuales de este lote continúan bloqueados por extracción incompleta: `UDEA_2017_1_J1_RL_049` y `UDEA_2017_1_J1_RL_072`.
- La interfaz ahora interpreta tanto recursos del enunciado como recursos asociados específicamente a las opciones A-D.

La fase 11 continúa abierta: faltan por verificar los exámenes sin clave y reparar el resto de registros incompletos o pendientes.

## Avance 3 - integridad del material necesario para responder

- La elegibilidad ahora exige no solo pregunta y opciones, sino también el material indispensable para responderla.
- Se extrajeron y verificaron seis textos fuente completos correspondientes a los tres exámenes con clave confirmada.
- Las 119 preguntas CL elegibles quedaron vinculadas a su texto uno, texto dos o a ambos cuando son preguntas comparativas.
- La interfaz presenta el texto original en un panel legible y desplazable antes del enunciado.
- La tabla requerida por `UDEA_2017_1_J1_RL_080` se reasignó desde una pregunta vecina y ahora aparece con la pregunta correcta.
- El banco conserva 207 preguntas elegibles: 119 CL con texto fuente y 88 RL; 21 de ellas incluyen material visual verificado.
- Las validaciones bloquean la compilación si una pregunta CL elegible carece de texto fuente o si un recurso referenciado no existe.

## Política ampliada de fuentes autorizada por el usuario

El usuario autorizó usar todo el contenido pertinente del ZIP. Para mantener la lógica y trazabilidad del proyecto:

- `Simulacro completo` y `Recrear histórico` conservarán la condición de examen histórico oficial UdeA.
- Material de otras universidades, Formarte, talleres y teoría podrá incorporarse al modo de práctica y a explicaciones, con su procedencia y tipo de fuente visibles.
- Ningún material externo será rotulado como examen histórico oficial UdeA.
- Toda pregunta, sin importar su fuente, deberá incluir el texto, fórmula, tabla, gráfica, imagen o estímulo indispensable y superar la misma validación de integridad.

## Avance 4 - corrección de enunciados de Razonamiento Lógico

- Se revisaron las 88 preguntas RL que estaban habilitadas y se identificaron 15 con pérdida comprobable de información.
- Se reconstruyeron 14 preguntas directamente desde las páginas fuente: ecuaciones, listas numéricas, condiciones, opciones y escenarios compartidos.
- Se añadieron cuatro recursos textuales compartidos para preguntas sobre números binarios, cajas y objetos, recorridos en un parque y pelotas de colores.
- Se recuperó la figura faltante de la región sombreada y se vinculó a su enunciado correcto.
- `UDEA_2017_1_J1_RL_059` fue bloqueada porque era un estímulo compartido extraído erróneamente como pregunta independiente.
- El banco queda con 206 preguntas elegibles: 119 CL y 87 RL. De ellas, 22 contienen recursos visuales y 124 incorporan texto fuente o contexto compartido.
