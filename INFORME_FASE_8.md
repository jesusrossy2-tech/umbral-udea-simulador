# Fase 8 de 10 — Interfaz web

## Estado

La fase 8 está **implementada en código y validada por tipos**, pero la compilación, vista previa y publicación quedaron bloqueadas por la política de seguridad de dependencias del entorno. No se aprobaron ni ejecutaron scripts de instalación bloqueados.

## Interfaz implementada

- Portada específica del simulador UdeA.
- Presentación visible de las condiciones inmutables: 80 preguntas, 40+40 y 180 minutos.
- Inicio de un simulacro de 80 preguntas históricas.
- Temporizador descendente real desde `03:00:00`.
- Autoenvío al llegar a cero.
- Navegador de las 80 preguntas.
- Indicadores de pregunta actual, respondida y pendiente.
- Separación visual entre Competencia Lectora y Razonamiento Lógico.
- Selección y cambio de respuestas A–D.
- Navegación anterior/siguiente.
- Presentación de imágenes de estímulo y opciones gráficas cuando existen.
- Entrega manual.
- Pantalla de resultados con correctas, incorrectas, omitidas, porcentaje, tiempo y desglose CL/RL.
- Aviso explícito de que el puntaje estandarizado no está disponible.
- Diseño adaptable para escritorio y móvil.

## Protección de respuestas

Las respuestas correctas permanecen en el módulo del servidor. La operación `GET /api/exam` elimina `correct_answer` antes de enviar las preguntas al navegador. Solo la operación `POST /api/exam`, al entregar, calcula el resultado.

## Datos integrados

La versión actual integra un simulacro reproducible de:

- 40 preguntas históricas de Competencia Lectora;
- 40 preguntas históricas de Razonamiento Lógico;
- recursos gráficos asociados;
- claves verificadas usadas únicamente en servidor.

## Validación realizada

- El conjunto contiene exactamente 80 preguntas, distribuidas 40+40.
- TypeScript finaliza sin errores mediante `tsc --noEmit`.
- Las respuestas no aparecen en el estado de cliente ni en la respuesta pública del endpoint.
- El diseño contempla teclado, botones semánticos, estados y avisos accesibles básicos.

## Bloqueo de compilación

El gestor de dependencias detuvo la instalación porque varios paquetes solicitan ejecutar scripts no aprobados (`esbuild`, `sharp`, `workerd` y otros). La política exige no autorizar ni eludir esos scripts automáticamente. Por ese motivo no se inició el servidor de desarrollo, no se abrió una vista previa y no se publicó el sitio.

## Pendiente para cerrar la fase

1. Autorizar las dependencias mediante el mecanismo de seguridad del entorno.
2. Ejecutar la compilación de producción.
3. Revisar el flujo completo en navegador.
4. Conectar persistencia duradera para sesiones; esto se ampliará en la fase 9.
5. Publicar el sitio de forma privada después de una compilación satisfactoria.

La siguiente fase será la **Fase 9: historial y evolución del estudiante**, pero no debería iniciarse hasta validar visualmente esta interfaz.

