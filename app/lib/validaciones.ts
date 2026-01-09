//Validaciones de campos 
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export function validarPassword(password: string): { valido: boolean; mensaje: string } {
  if (password.length < 6) {
    return { valido: false, mensaje: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { valido: true, mensaje: '' };
}

export function validarPasswordsCoinciden(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}

export function validarCampoRequerido(valor: string): boolean {
  return valor.trim().length > 0;
}

export function validarMatricula(matricula: string): boolean {
  return matricula.trim().length > 0;
}
