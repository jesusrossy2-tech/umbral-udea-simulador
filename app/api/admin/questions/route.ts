const unavailable = () => Response.json(
  { error: 'Ruta administrativa no disponible en producción.' },
  { status: 404, headers: { 'Cache-Control': 'no-store' } },
);

// La administración del banco se realiza fuera del sitio público. Mantener la
// ruta cerrada evita exponer claves de respuesta o permitir cambios anónimos.
export async function GET() {
  return unavailable();
}

export async function POST() {
  return unavailable();
}
