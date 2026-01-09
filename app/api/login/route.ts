import {conn} from "@/app/lib/conexion"
import { NextResponse } from "next/server"
import { generateToken } from "@/app/lib/jwt"
import { RowDataPacket } from "mysql2";
import { User, Login } from "@/app/lib/types";
import bcrypt from 'bcrypt';
//Inicio de sesion verificando contraseña y matrucula en la base de datos
export async function POST(request:Request): Promise<NextResponse>{
    try{
        const data = await request.json();
        const { matricula, password }:Login= data;
        if (!matricula || !password) {
            return NextResponse.json({
                success: false,
                message: 'Matricula y contraseña son requeridos'
            });
        }
        const [usersAll] = await conn.execute<RowDataPacket[]>(
            "SELECT id, nombre, apellidos, correo, matricula, tipo, password FROM users WHERE matricula=?",
            [matricula]
        );
        
        const user = usersAll as (User & { password: string })[];
        
        if (!user || user.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'Matrícula o contraseña incorrectos'
            });
        }

        const usuario = user[0];
        const passwordCompare = await bcrypt.compare(password, usuario.password);
        
        if (!passwordCompare) {
            return NextResponse.json({
                success: false,
                message: 'Matrícula o contraseña incorrectos'
            });
        }
        const tipo = usuario.tipo == "usuario" ? 'estudiante' : "admin";

        const token = generateToken({
            matricula: usuario.matricula.toString(),
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            tipo: tipo
        });

        return NextResponse.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            tipo: tipo,
            token: token,
            usuario: {
                id:usuario.id,
                correo:usuario.correo,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                matricula: usuario.matricula,
                tipo: usuario.tipo
            }
        });

    } catch(error){
        console.error('Error en login:', error);
        return NextResponse.json({
            success: false,
            message: 'Error del servidor'
        });
    }
}