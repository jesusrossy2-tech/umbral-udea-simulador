# Auditoría completa del sistema — Umbral UdeA

**Fecha de corte:** 14 de septiembre de 2026 (America/Bogota)  
**Versión auditada del código local:** `16d13d3024d0221506fe746d216c9a5cd9b84572`  
**Sitio:** <https://umbral-udea-simulador.ciovonhorst.chatgpt.site/>  
**Repositorio:** <https://github.com/jesusrossy2-tech/umbral-udea-simulador>  
**Proyecto de Sites:** `appgprj_6aa7191831748191ad672afb839570c0`

## 1. Resumen ejecutivo

Umbral UdeA es un simulador educativo independiente para practicar con preguntas históricas de admisión de la Universidad de Antioquia. El producto está compilado, desplegado y accesible públicamente. Su núcleo funcional está completo: genera simulacros, recrea cinco exámenes históricos, ofrece práctica filtrada, cronometra, califica, conserva progreso anónimo y produce recomendaciones básicas por tema.

La integridad estructural del banco es alta: 437 de 474 registros cumplen simultáneamente los requisitos de procedencia histórica, literalidad verificada, respuesta confirmada, cuatro opciones completas y material de apoyo disponible cuando es necesario. Los 37 registros restantes están bloqueados y no llegan al estudiante.

El sistema **no registra cuentas**. Cada navegador recibe un UUID aleatorio guardado en `localStorage`; este identificador permite consultar o borrar el progreso asociado. Por esta razón no existe inicio de sesión, recuperación de cuenta ni sincronización entre dispositivos.

La auditoría encontró cuatro frentes importantes antes de considerar el producto endurecido para crecimiento público:

1. El repositorio es público y contiene el banco completo con `correct_answer`, por lo que las claves pueden consultarse directamente en GitHub.
2. La API devuelve las respuestas correctas después de entregar un intento; un proceso automatizado podría iniciar y entregar simulacros vacíos para extraer claves.
3. No hay limitación de frecuencia, protección contra automatización ni limpieza automática de simulaciones abandonadas.
4. No existe política automática de retención; los intentos permanecen hasta que el usuario los elimina con el identificador del navegador.

## 2. Alcance y método

La revisión cubrió:

- interfaz y flujo del estudiante;
- rutas públicas de la API;
- motor de selección y calificación;
- banco de preguntas, textos e imágenes;
- esquema y migraciones de D1;
- privacidad y eliminación de datos;
- configuración de construcción y despliegue;
- exposición de secretos y claves;
- estado del repositorio de GitHub;
- compilación, lint y validadores propios;
- comprobaciones HTTP no destructivas sobre producción.

No se realizó una prueba de penetración, prueba de carga, auditoría jurídica ni copia de la base D1 en producción. Tampoco se generaron intentos reales durante la comprobación HTTP, para no modificar datos operativos.

## 3. Qué hace el sistema

### 3.1 Portada y catálogo

- Consulta el catálogo disponible desde `GET /api/catalog`.
- Muestra cantidad total y cantidad elegible del banco.
- Enumera los históricos y solo habilita los que tienen exactamente 80 preguntas: 40 CL y 40 RL.
- Permite elegir sección, tema y cantidad para prácticas personalizadas.
- Expone accesos al progreso y a la información de privacidad.
- Advierte que el proyecto es independiente y no es un sitio oficial de la Universidad de Antioquia.

### 3.2 Simulacro completo

- Construye 80 preguntas: 40 de Competencia Lectora y 40 de Razonamiento Lógico.
- Mezcla preguntas verificadas de más de un examen histórico.
- Distribuye cada sección proporcionalmente entre los temas disponibles.
- Prioriza preguntas no vistas en los diez intentos más recientes.
- Asigna 180 minutos.
- Presenta navegador de preguntas, estado respondido/pendiente y navegación anterior/siguiente.
- Permite entregar manualmente o entrega automáticamente al terminar el tiempo.

### 3.3 Recreación de examen histórico

Están habilitados cinco exámenes completos:

- UDEA 2017-1 J1;
- UDEA 2017-2 J1;
- UDEA 2018-1 J2;
- UDEA 2019-1 J1;
- UDEA 2019-2 J1.

Cada uno conserva la secuencia 1–80 y la distribución 40 CL + 40 RL. El bloque UDEA 2018-1 J3 posee 37 preguntas RL verificadas, pero no se ofrece como examen completo porque falta una clave confirmada para Competencia Lectora.

### 3.4 Práctica personalizada

- Filtra por CL o RL.
- Permite filtrar por tema; el motor también admite subtema y dificultad.
- Acepta entre 5 y 40 preguntas.
- Usa aproximadamente 90 segundos por pregunta, con un mínimo de cinco minutos.
- Prioriza preguntas no vistas recientemente.

### 3.5 Presentación de preguntas y materiales

- Renderiza el enunciado y cuatro opciones A–D.
- Inserta textos completos o estímulos compartidos mediante `text_resources`.
- Inserta imágenes de estímulo, pregunta u opciones en su ubicación correspondiente.
- El banco elegible contiene 79 preguntas con recursos visuales, que utilizan 100 archivos visuales únicos.
- Hay 27 recursos textuales compartidos y 226 preguntas elegibles enlazadas a algún texto.
- Las 200 preguntas CL elegibles tienen texto fuente válido.

### 3.6 Calificación y resultados

- La calificación ocurre en el servidor.
- Clasifica cada respuesta como correcta, incorrecta u omitida.
- Calcula total y porcentaje general.
- Desglosa los resultados de CL y RL.
- Registra tiempo empleado y si la entrega ocurrió por agotamiento del tiempo.
- No inventa un puntaje estandarizado: lo marca expresamente como no disponible por falta de evidencia suficiente sobre el método oficial.

### 3.7 Historial

- Conserva cada intento terminado en D1.
- Presenta hasta los 30 intentos más recientes.
- Muestra fecha, duración, aciertos totales y aciertos por sección.
- El historial se vincula a un identificador aleatorio del navegador.
- Cambiar de navegador, borrar el almacenamiento local o usar otro dispositivo rompe el vínculo con el historial anterior.

### 3.8 Recomendaciones

- Analiza hasta los diez intentos más recientes.
- Calcula precisión general y precisión por tema.
- Ordena hasta tres prioridades empezando por la menor precisión observada.
- Muestra hasta tres fortalezas con al menos dos observaciones.
- Recomienda practicar hasta 15 preguntas históricas del tema débil, dependiendo de la disponibilidad.
- No afirma causas conceptuales que los datos no demuestran.

### 3.9 Privacidad y borrado

- No solicita nombre, correo, documento, contraseña ni ubicación.
- Guarda en el navegador únicamente un UUID aleatorio.
- Guarda en D1 simulaciones, respuestas resumidas, resultados y detalle por pregunta.
- Permite borrar intentos y simulaciones asociados al UUID mediante la interfaz.
- Al borrar, elimina también el UUID local y genera uno distinto en un uso posterior.

### 3.10 Administración

- El panel administrativo no está presente en la interfaz pública.
- `GET` y `POST /api/admin/questions` responden 404.
- La curación del banco se realiza fuera del sitio mediante datos, scripts reproducibles y validadores.

## 4. Arquitectura

| Capa | Implementación | Responsabilidad |
|---|---|---|
| Interfaz | React 19, Next 16 y Vinext | Portada, examen, resultados, historial, recomendaciones y privacidad |
| API | Route handlers en `app/api` | Catálogo, creación/entrega, historial y recomendaciones |
| Motor | `lib/exam-engine.ts` | Elegibilidad, selección, estratificación, antirrepetición y saneamiento |
| Banco | JSON versionado | Preguntas, claves, metadatos, textos y enlaces a imágenes |
| Persistencia | Cloudflare D1 + Drizzle | Simulaciones, intentos y estados de revisión |
| Hosting | OpenAI Sites sobre Cloudflare | Construcción, Worker, dominio y enlace con D1 |
| Recuperación | Git, Git bundle, ZIP y GitHub | Reconstrucción del código y conservación de fuentes |

### Flujo principal

1. El navegador crea o recupera su UUID.
2. La interfaz solicita un examen a `/api/exam`.
3. El servidor filtra preguntas verificadas, bloquea preguntas en revisión y construye la selección.
4. El servidor guarda la simulación y devuelve preguntas saneadas sin clave.
5. El navegador conserva temporalmente las respuestas elegidas.
6. Al entregar, el servidor recupera la selección original y califica contra el banco.
7. D1 guarda el intento y el servidor devuelve el resumen.
8. Historial y recomendaciones consultan los registros vinculados al UUID.

## 5. Datos y base de preguntas

| Métrica | Resultado auditado |
|---|---:|
| Registros totales | 474 |
| Preguntas elegibles | 437 |
| Competencia Lectora elegible | 200 |
| Razonamiento Lógico elegible | 237 |
| Fuentes históricas con preguntas elegibles | 6 |
| Históricos completos recreables | 5 |
| Preguntas elegibles con material visual | 79 |
| Archivos visuales únicos utilizados | 100 |
| Recursos textuales compartidos | 27 |
| Preguntas elegibles con texto enlazado | 226 |
| Pendientes de revisión | 37 |
| Registros incompletos | 0 |

Una pregunta solo entra a producción cuando cumple todas estas condiciones:

- `official_exam_eligible` activo;
- procedencia `historical_exam`;
- confianza distinta de `uncertain`;
- literalidad `verified`;
- estado administrativo `verified`;
- cuatro opciones no vacías;
- respuesta A, B, C o D confirmada;
- texto e imágenes existentes cuando el enunciado los requiere;
- no estar bloqueada por `question_reviews`.

## 6. Persistencia

### Tabla `simulations`

Conserva ID de simulación, UUID del navegador, modalidad, histórico de origen, lista de preguntas, hora de inicio, duración y hora de entrega.

### Tabla `attempts`

Conserva ID del intento, UUID, examen, fecha, duración, agotamiento de tiempo, correctas, incorrectas, omitidas, porcentaje, aciertos CL/RL, detalle por pregunta y modalidad.

### Tabla `question_reviews`

Permite bloquear preguntas por ID sin modificar inmediatamente el archivo del banco. La ruta administrativa pública está cerrada.

## 7. Seguridad y privacidad

### Controles que funcionan

- Las consultas D1 usan parámetros enlazados, reduciendo el riesgo de inyección SQL.
- El UUID debe cumplir una expresión regular de 16 a 80 caracteres alfanuméricos o guiones.
- `GET /api/exam` elimina `correct_answer`, `answer_key_source` y razones internas antes de enviar preguntas.
- La entrega solo acepta una simulación perteneciente al mismo UUID y rechaza una segunda entrega ya registrada.
- El tiempo informado se limita al intervalo entre cero y la duración configurada.
- La administración pública devuelve 404.
- No hay secretos, `.env`, claves privadas ni credenciales versionadas.
- La aplicación funciona exclusivamente por HTTPS en producción.
- El usuario dispone de eliminación de progreso.

### Hallazgos

| Prioridad | Hallazgo | Impacto | Recomendación |
|---|---|---|---|
| Alta | El repositorio público contiene `data/question_bank.json` con `correct_answer`. | Las claves completas son visibles y descargables; la protección del endpoint no protege el repositorio. | Convertir el repositorio en privado o separar banco/claves en un repositorio o almacenamiento privado. Mantener público solo el código sin contenido protegido. |
| Alta | `POST /api/exam` devuelve `correctAnswer` para las 80 preguntas inmediatamente después de cualquier entrega. | Permite automatizar simulacros vacíos y extraer claves aunque GitHub se vuelva privado. | No devolver claves masivas. Ofrecer revisión limitada, diferida o autenticada; añadir límites de frecuencia y controles contra extracción. |
| Media | No existe limitación de frecuencia en las rutas que crean simulaciones o entregan intentos. | Bots pueden consumir almacenamiento D1 y recursos del Worker. | Añadir rate limiting por IP/identificador, cuota diaria y limpieza de simulaciones abandonadas. |
| Media | El UUID funciona como credencial portadora y viaja en la URL para historial y recomendaciones. | Quien obtenga el UUID puede leer o borrar ese progreso; las URLs pueden aparecer en registros. | Usar sesión segura mediante cookie `HttpOnly`, o autenticación opcional; enviar identificadores sensibles fuera de query strings. |
| Media | No hay retención automática. | Los datos abandonados permanecen indefinidamente si el usuario pierde su UUID. | Definir una política de retención y una tarea de purga, por ejemplo 12 o 18 meses de inactividad. |
| Media | No se observan cabeceras CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy` en la respuesta auditada. | Reduce la defensa en profundidad del navegador. | Configurar las cabeceras compatibles con Sites/Cloudflare y verificar que no rompan los recursos. |
| Media | El tiempo se controla principalmente en el cliente; el servidor no compara entrega con `started_at`. | Un cliente modificado puede continuar después del límite o falsificar `timedOut`. | Calcular vencimiento en servidor y rechazar o marcar automáticamente entregas tardías. |
| Media | Dos entregas simultáneas pueden superar la comprobación previa antes de marcar `submitted_at`. | Podrían producir intentos duplicados en una carrera poco frecuente. | Usar actualización condicional/transacción y una restricción única por simulación. |
| Media | El repositorio público no contiene licencia, política de contenido ni atribución detallada. | Ambigüedad sobre reutilización del código y de los materiales históricos. | Añadir licencia del código, política de contenidos, aviso de marcas y documentación de la autorización disponible. |
| Baja | No hay pruebas unitarias, de integración o end-to-end versionadas. | Las regresiones dependen de validadores especializados y revisión manual. | Añadir pruebas del motor, APIs, temporizador, borrado, materiales y navegación. |
| Baja | Lint presenta seis advertencias. | No bloquean producción, pero tres imágenes carecen de optimización automática y hay variables deliberadamente descartadas. | Resolver o justificar reglas y añadir dimensiones/carga diferida cuando convenga. |
| Baja | No hay CI visible en `.github/workflows`. | Un cambio puede llegar a GitHub sin ejecutar los controles. | Añadir CI para instalar, validar banco, lint y build en cada cambio. |
| Baja | `tsconfig.tsbuildinfo` está versionado. | Añade ruido y puede quedar obsoleto. | Excluirlo mediante `.gitignore` si no forma parte deliberada del artefacto. |

## 8. Pruebas ejecutadas

### Banco

`node scripts/validate_phase11_bank.mjs`: **aprobado**.

- IDs sin duplicados.
- Recursos visuales existentes y con ubicación válida.
- Material textual obligatorio enlazado.
- Claves de cinco históricos verificadas.
- Secuencias completas 1–80 y contrato 40+40.
- 437 elegibles, 37 pendientes y cero incompletas.

### Construcción

`pnpm build`: **aprobado**.

Se compilaron `/`, `/api/admin/questions`, `/api/catalog`, `/api/exam`, `/api/history` y `/api/recommendations`.

### Calidad estática

`pnpm lint`: **aprobado con seis advertencias y cero errores**.

### Preparación de producción

`node scripts/validate_production_readiness.mjs`: **aprobado**.

- artefactos del Worker presentes;
- administración cerrada;
- privacidad visible;
- claves saneadas en la respuesta inicial;
- 437 preguntas elegibles;
- cinco históricos completos.

### Producción, comprobación HTTP no destructiva

| Recurso | Resultado |
|---|---|
| `/` | 200, interfaz HTML disponible |
| `/api/catalog` | 200, 474 totales, 437 elegibles, cinco históricos listos |
| `/api/admin/questions` | 404, administración cerrada |
| `/api/history` con UUID nuevo de prueba | 200, historial vacío |
| `/api/recommendations` con UUID nuevo de prueba | 200, recomendaciones vacías |
| `/api/exam` con identificador inválido | 400, validación activa |

## 9. Recuperación y continuidad

El sistema puede reconstruirse a partir de tres piezas:

1. El repositorio de GitHub contiene la fotografía ejecutable actual del código, banco y recursos usados por el sitio.
2. El respaldo integral local contiene documentos originales, ZIP fuente, estructura, instrucciones y sumas SHA-256.
3. El Git bundle local conserva el historial completo anterior a la publicación en GitHub.

Limitaciones de continuidad:

- GitHub no contiene los ZIP fuente de cientos de megabytes.
- La copia actual no incluye una exportación de los registros vivos de D1.
- El repositorio remoto contiene una importación del estado actual, no todo el historial local previo; ese historial está en el bundle.
- Para conservar progreso de usuarios ante una pérdida del proveedor debe programarse una exportación cifrada de D1.

## 10. Evaluación por área

| Área | Estado | Comentario |
|---|---|---|
| Funcionalidad principal | Aprobada | Los tres modos, calificación, historial y recomendaciones están implementados. |
| Integridad estructural del banco | Aprobada | 437 preguntas pasan controles automáticos; 37 permanecen bloqueadas. |
| Material visual y textual | Aprobado para elegibles | El validador exige la existencia del apoyo requerido. |
| Compilación | Aprobada | Build de producción sin errores. |
| Calidad estática | Aprobada con observaciones | Cero errores y seis advertencias. |
| Protección de claves en API inicial | Aprobada | El examen inicial no entrega `correct_answer`. |
| Protección integral de claves | Requiere corrección | GitHub público y respuesta posterior a la entrega permiten extracción. |
| Privacidad básica | Aprobada con observaciones | Sin PII solicitada y con borrado, pero sin retención ni sesión protegida. |
| Cuentas y sincronización | No implementadas | Diseño anónimo por navegador. |
| Resistencia a abuso | Requiere corrección | Sin rate limiting ni cuotas. |
| Accesibilidad | Parcialmente revisada | Hay etiquetas, textos alternativos y controles nativos; falta auditoría WCAG manual/automática. |
| Rendimiento | Aceptable, no medido | Build correcto; no hubo prueba Lighthouse o de carga. |
| Recuperación de código | Aprobada | ZIP, GitHub y bundle disponibles. |
| Recuperación de datos vivos | Pendiente | Falta automatizar exportación de D1. |

## 11. Plan recomendado

### Antes de ampliar difusión

1. Decidir si el banco y las claves deben continuar visibles en GitHub; la opción más segura es repositorio privado o separación de datos.
2. Evitar la devolución masiva de `correctAnswer` y diseñar una revisión pedagógica que no facilite extracción.
3. Añadir rate limiting y limpieza de simulaciones abandonadas.
4. Publicar licencia, política de contenidos y documentación de autorización.

### Siguiente iteración

5. Implementar retención y purga de datos.
6. Mover el identificador a una sesión más segura o añadir cuentas opcionales si se necesita sincronización.
7. Hacer que el servidor determine el vencimiento real.
8. Añadir pruebas automáticas y CI.
9. Añadir cabeceras de seguridad compatibles.
10. Automatizar respaldos cifrados de D1 y probar una restauración completa.

### Mejoras posteriores

11. Auditoría WCAG 2.2 AA y navegación completa por teclado/lector de pantalla.
12. Pruebas Lighthouse y de carga.
13. Panel privado de curación con autenticación fuerte, solo si realmente se necesita operar el banco desde la web.
14. Cuentas opcionales y recuperación de progreso entre dispositivos, manteniendo disponible el modo anónimo.

## 12. Conclusión

El sistema está funcional, reproducible y correctamente desplegado para uso educativo. La selección de preguntas elegibles y la integridad de sus apoyos están bien defendidas mediante validadores. La principal deuda no está en la simulación, sino en el endurecimiento para una exposición pública sostenida: confidencialidad de las claves, prevención de extracción automatizada, control de abuso, retención de datos y continuidad de D1.

La prioridad inmediata debe ser proteger el banco y las claves antes de aumentar la audiencia. Después, las mejoras de sesión, retención, pruebas y respaldos permitirán convertir el prototipo productivo actual en un servicio más robusto y mantenible.
