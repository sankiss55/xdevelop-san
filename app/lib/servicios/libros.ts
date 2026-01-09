
import { Libro } from '../types';

export async function obtenerLibros() {
  const response = await fetch('/api/libros', {
    method: 'GET'
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function crearLibro(libroData: any, idUsuario: number) {

  const response = await fetch("/api/libros", {
    method: "POST",
    body: JSON.stringify({
      ...libroData,
      id_user: idUsuario
    }),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function actualizarLibro(id: number, libroData: any) {
  const response = await fetch(`/api/libros/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(libroData),
  });

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function eliminarLibro(id: number) {
  const response = await fetch(`/api/libros/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();
  return { ok: response.ok, data };
}
