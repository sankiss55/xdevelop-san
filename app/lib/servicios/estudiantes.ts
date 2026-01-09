
interface DatosRegistro {
  nombre: string;
  apellidos: string;
  matricula: string;
  correo: string;
  password: string;
}

interface DatosActualizacion {
  nombre: string;
  apellidos: string;
  correo: string;
  matricula: number;
}

export async function registrarEstudiante(datos: DatosRegistro) {
  const response = await fetch('/api/estudiantes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos)
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function actualizarEstudiante(datos: DatosActualizacion) {
  const response = await fetch("/api/estudiantes", {
    method: "PUT",
    body: JSON.stringify(datos)
  });

  const data = await response.json();
  return { ok: response.ok, data };
}
