//validación de JWT **requerimiento**
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_KEY_SECRET as string;

export interface TokenJWT {
  id: number;
  matricula: string;
  nombre: string;
  apellidos: string;
  tipo: string;
}
//crea un token JWT con la llave secreta y poniendo un tiempo de expiración de 3dias 
export function generateToken(payload: TokenJWT): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_KEY_SECRET no está definida en las variables de entorno');
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '3d' 
  });
}
//verificacin del token JWT 
export function verifyToken(token: string): TokenJWT | boolean | null {
  if (!JWT_SECRET) {
    return false;
  }
  try {
    return jwt.verify(token, JWT_SECRET) as TokenJWT;
  } catch (error) {
    return false;
  }
}