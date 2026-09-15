# Fase 10 de 10 — Recomendaciones personalizadas

## Estado

La fase 10 está implementada y preparada para su publicación en el sitio privado de Umbral UdeA.

## Funcionalidad incorporada

- Análisis de hasta los 10 intentos más recientes.
- Cálculo de precisión global usando respuestas reales.
- Identificación de hasta tres prioridades por tema y componente.
- Identificación de fortalezas observadas con evidencia repetida.
- Plan ordenado de práctica con cantidades ajustadas a las preguntas históricas disponibles.
- Acceso al plan desde la pantalla de resultados y desde «Mi progreso».
- Estado inicial que solicita completar un simulacro cuando todavía no hay datos.
- Explicación visible de la metodología usada.

## Criterios de prudencia

- No se atribuye una causa conceptual a una respuesta incorrecta.
- Los temas sin clasificación no se convierten en recomendaciones inventadas.
- Las prioridades se basan en la precisión observada, no en perfiles supuestos.
- Las cantidades recomendadas nunca superan la disponibilidad histórica registrada para el tema.

## Privacidad y datos

El análisis utiliza el identificador anónimo de la fase 9. No requiere nombre, correo ni creación de cuenta. El navegador conserva el identificador y el sitio consulta los resultados persistidos en D1.

## Validación

- TypeScript sin errores.
- Compilación de producción satisfactoria.
- Rutas disponibles: `/`, `/api/exam`, `/api/history` y `/api/recommendations`.
- La entrega del simulacro, el historial y las recomendaciones comparten la misma fuente de resultados.

## Cierre del plan de diez fases

Con esta entrega queda completado el recorrido funcional: auditoría, estructura, banco, validación, simulación, calificación, diagnóstico, interfaz, historial y recomendaciones.

El documento correctivo de fase 11 se considera una ampliación posterior y separada. No se aplicó como parte de esta fase 10.
