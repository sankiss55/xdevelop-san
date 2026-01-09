
export function limpiarFormularioLibro() {
  return {
    titulo: '',
    autor: '',
    identificador: '',
    genero: '',
    anio_publicacion: '',
  };
}

export function convertirLibroAFormulario(libro: any) {
  return {
    titulo: libro.titulo,
    autor: libro.autor,
    identificador: libro.identificador,
    genero: libro.genero,
    anio_publicacion: libro.anio_publicacion.toString(),
  };
}

export function prepararDatosLibro(formData: any, anioComoNumero: boolean = false) {
  if (anioComoNumero) {
    return {
      ...formData,
      anio_publicacion: parseInt(formData.anio_publicacion)
    };
  }
  return formData;
}
