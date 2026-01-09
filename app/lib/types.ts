//tipos más usados en el proyecto
export type Login={
    matricula:number,
    password:string
}
export type User={
    id: number,
nombre: string,
apellidos:string,
matricula:number,
correo:string, 
tipo:string,
}
export type Libro={
    id: number,
  titulo:string,
  autor:string,
  identificador:string, 
  genero:string,
  anio_publicacion:number
}
