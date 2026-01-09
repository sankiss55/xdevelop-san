//CRUD

import { NextRequest, NextResponse } from "next/server";
import { conn } from "@/app/lib/conexion";
import { Libro } from "@/app/lib/types";
// Traer los libors disponibles en la base de datos
export async function GET(): Promise<NextResponse> {
  try {
    const [libros]: any = await conn.execute(
      "SELECT id, titulo, autor, identificador, genero, anio_publicacion FROM libros"
    );
    
    return NextResponse.json({ 
      success: true, 
      libros: libros 
    });
  } catch (error) {
    console.error('Error al obtener libros:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al obtener los libros',
      libros: [] 
    });
  }
}
//Cambiar informacion del libro seleccionadopor el administrador
export async function POST(params:NextRequest):Promise<NextResponse> {
  try{
    const {titulo,autor,identificador, genero,anio_publicacion, id}:Libro&{id:string}= await params.json();
    const [busqueda]: any= await conn.execute("SELECT * FROM libros where identificador=?",[identificador]);
    if (busqueda.length>0) {
    throw new Error  (`El libro con el identificador "${identificador}" ya existe`);
}
const date=new Date()
    await conn.execute("INSERT INTO libros (titulo, autor, identificador, genero, anio_publicacion, registrado_por, created_at, updated_at) VALUES( ?,?,?,?,?,?,?,?)", [titulo, autor,identificador,genero,anio_publicacion,id,date, date]);
    return NextResponse.json({
      success: true,
    })
  }catch(error){
  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error
        ? error.message
        : "Error al subir el libro",
    }
  );
}

  }
