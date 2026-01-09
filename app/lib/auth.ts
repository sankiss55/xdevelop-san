//validación de JWT **requerimiento**
export async function verificacion() {

  const token = localStorage.getItem('token');

  if (!token) {
    return { autenticado: false, usuario: null };
  }

  try {
    const res = await fetch('/api/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { autenticado: false, usuario: null };
    }

    try {
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
    } catch (e) {
      console.error('No se pudo guardar usuario en localStorage:', e);
    }

    return { autenticado: true, usuario: data.usuario };
  } catch (error) {
    console.error('Error verificando sesión:', error);
    return { autenticado: false, usuario: null };
  }
}

export function cerrarSesion() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
}
