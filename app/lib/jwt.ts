//validación de JWT **requerimiento**
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_KEY_SECRET;

export interface TokenJWT {
  matricula: string;
  nombre: string;
  apellidos: string;
  tipo: string;
}
//crea un token JWT con la llave secreta y poniendo un tiempo de expiración de 3dias 
export function generateToken(payload: TokenJWT): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '3d' 
  });
}
//verificacin del token JWT 
export function verifyToken(token: string): TokenJWT | boolean | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenJWT;
  } catch (error) {
    return false;
  }
}