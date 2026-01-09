
//Filtros necesarios **requeridos**
import { Libro } from '../types';

export function filtrarPorTexto(libros: Libro[], busqueda: string): Libro[] {
  if (busqueda.trim() === '') return libros;
  
  const busquedaLower = busqueda.toLowerCase();
  return libros.filter(libro =>
    libro.titulo.toLowerCase().includes(busquedaLower) ||
    libro.autor.toLowerCase().includes(busquedaLower) ||
    libro.identificador.toLowerCase().includes(busquedaLower) ||
    libro.genero.toLowerCase().includes(busquedaLower)
  );
}

export function filtrarPorGenero(libros: Libro[], genero: string): Libro[] {
  if (!genero) return libros;
  return libros.filter(libro => libro.genero === genero);
}

export function filtrarPorAnio(libros: Libro[], anio: string): Libro[] {
  if (!anio) return libros;
  return libros.filter(libro => libro.anio_publicacion.toString() === anio);
}

export function aplicarFiltros(
  libros: Libro[],
  busqueda: string,
  genero: string,
  anio: string
): Libro[] {
  const busquedaLower = busqueda.toLowerCase();
  
  return libros.filter(libro => {
    const cumpleBusqueda = !busqueda || 
      libro.titulo.toLowerCase().includes(busquedaLower) ||
      libro.autor.toLowerCase().includes(busquedaLower) ||
      libro.genero.toLowerCase().includes(busquedaLower);

    const cumpleGenero = !genero || libro.genero === genero;
    const cumpleAnio = !anio || libro.anio_publicacion.toString() === anio;

    return cumpleBusqueda && cumpleGenero && cumpleAnio;
  });
}

export function obtenerGenerosUnicos(libros: Libro[]): string[] {
  return [...new Set(libros.map(libro => libro.genero))];
}
