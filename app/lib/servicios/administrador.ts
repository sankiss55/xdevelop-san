import { Libro } from '../types';

export async function obtenerLibrosAdmin() {
  try {
    const response = await fetch('/api/libros');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar libros:', error);
    throw error;
  }
}

export async function agregarLibro(formData: any, usuarioId: number) {
  try {
    const response = await fetch("/api/libros", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        id: usuarioId
      }),
    });

    if (!response.ok) {
      throw new Error("Error al guardar el libro, intentelo mas tarde");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function eliminarLibro(id: number) {
  try {
    const response = await fetch(`/api/libros/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    throw error;
  }
}

export async function actualizarLibroAdmin(id: number, formData: any) {
  try {
    const response = await fetch(`/api/libros/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        anio_publicacion: parseInt(formData.anio_publicacion)
      }),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    throw error;
  }
}
