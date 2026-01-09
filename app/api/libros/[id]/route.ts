//CRUD

import { conn } from "@/app/lib/conexion";
import { NextRequest, NextResponse } from "next/server";
import { Libro } from "@/app/lib/types";
//eliminar libro mediante su id 
export async function DELETE(params: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(params.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      throw new Error("ID del libro no proporcionado");
    }

    const [libroExistente]: any = await conn.execute("SELECT * FROM libros WHERE id=?", [id]);
    if (libroExistente.length === 0) {
      throw new Error("El libro no existe");
    }

    await conn.execute("DELETE FROM libros WHERE id=?", [id]);
    
    return NextResponse.json({
      success: true,
      message: "Libro eliminado correctamente"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
//Actualizacion de datos de un libro
export async function PUT(params: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(params.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      throw new Error("ID del libro no proporcionado");
    }

    const { titulo, autor, identificador, genero, anio_publicacion }: Libro = await params.json();
    const [libroExistente]: any = await conn.execute("SELECT * FROM libros WHERE id=?", [id]);
    if (libroExistente.length === 0) {
      throw new Error("El libro no existe");
    }
    const [busqueda]: any = await conn.execute(
      "SELECT * FROM libros WHERE identificador=? AND id!=?",
      [identificador, id]
    );
    if (busqueda.length > 0) {
      throw new Error("El identificador ya está en uso por otro libro");
    }

    const date = new Date();
    await conn.execute(
      "UPDATE libros SET titulo=?, autor=?, identificador=?, genero=?, anio_publicacion=?, updated_at=? WHERE id=?",
      [titulo, autor, identificador, genero, anio_publicacion, date, id]
    );
    
    return NextResponse.json({
      success: true,
      message: "Libro actualizado correctamente"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}
