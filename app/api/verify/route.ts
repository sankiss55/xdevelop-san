import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/jwt';
// Verificación de JWT en el servidor
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const token = authHeader.substring(7); 
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    return NextResponse.json({
      success: true,
      usuario: decoded
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    return NextResponse.json({
      success: false,
      message: 'Error del servidor'
    });
  }
}
