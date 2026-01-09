import { NextRequest, NextResponse } from "next/server"
import { conn } from "@/app/lib/conexion"
import { User } from "@/app/lib/types";
import bcrypt from 'bcrypt';
//Cambiar datos del usuario (alumno)
export async function PUT(request:NextRequest):Promise<NextResponse>{
    try{
        
    const { nombre, apellidos, correo, matricula }: { nombre: string; apellidos: string; correo: string, matricula:number} = await request.json();

        const [data]= await conn.execute("UPDATE users SET nombre=?, apellidos=?, correo=? where matricula=?",[nombre, apellidos, correo,matricula]);    

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}

//Creacion de un nuevo usuario (alumno)
export async function POST(params: NextRequest): Promise<NextResponse> {
  try {
    const { nombre, apellidos, matricula, correo, password }: User & { password: string } = await params.json();
    if (!nombre || !apellidos || !matricula || !correo || !password) {
      return NextResponse.json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }
    const [existente]: any = await conn.execute(
      "SELECT * FROM users WHERE matricula = ?",
      [matricula]
    );

    if (existente.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'La matrícula ya está registrada'
      });
    }
    const [correoExistente]: any = await conn.execute(
      "SELECT * FROM users WHERE correo = ?",
      [correo]
    );

    if (correoExistente.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'El correo ya está registrado'
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const date = new Date();
    await conn.execute(
      "INSERT INTO users (nombre, apellidos, matricula, correo, password, tipo, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellidos, matricula, correo, hashedPassword, 'usuario', date, date]
    );

    return NextResponse.json({
      success: true,
      message: 'Estudiante registrado exitosamente'
    });

  } catch (error) {
    console.error('Error al registrar estudiante:', error);
    return NextResponse.json({
      success: false,
      message: 'Error al registrar el estudiante'
    });
  }
}