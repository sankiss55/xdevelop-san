import { Libro } from '../types';

export function procesarExcelAFormulario(rows: any[][]): any {
  const encabezados = rows[0];
  const datos = rows[1];
  
  const formData = {
    titulo: '',
    autor: '',
    identificador: '',
    genero: '',
    anio_publicacion: '',
  };

  encabezados.forEach((columna, index) => {
    const nombreColumna = columna.toString().toLowerCase().trim();
    const valor = datos[index] ? datos[index].toString() : '';
    
    if (nombreColumna === 'titulo' || nombreColumna === 'título') {
      formData.titulo = valor;
    } else if (nombreColumna === 'autor') {
      formData.autor = valor;
    } else if (nombreColumna === 'identificador') {
      formData.identificador = valor;
    } else if (nombreColumna === 'genero' || nombreColumna === 'género') {
      formData.genero = valor;
    } else if (nombreColumna === 'año de publicacion' || nombreColumna === 'año de publicación' || nombreColumna === 'anio_publicacion') {
      formData.anio_publicacion = valor;
    }
  });

  return formData;
}

export function filtrarLibrosPorBusqueda(libros: Libro[], busqueda: string): Libro[] {
  if (busqueda.trim() === '') {
    return libros;
  }
  
  return libros.filter(libro => 
    libro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.autor.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.identificador.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.genero.toLowerCase().includes(busqueda.toLowerCase())
  );
}

export function inicializarFormularioEdicion(libro: Libro) {
  return {
    titulo: libro.titulo,
    autor: libro.autor,
    identificador: libro.identificador,
    genero: libro.genero,
    anio_publicacion: libro.anio_publicacion.toString(),
  };
}

export function limpiarFormulario() {
  return {
    titulo: '',
    autor: '',
    identificador: '',
    genero: '',
    anio_publicacion: '',
  };
}

export function procesarCambioFormulario(
  formData: any, 
  nombre: string, 
  valor: string
) {
  return {
    ...formData,
    [nombre]: valor
  };
}
