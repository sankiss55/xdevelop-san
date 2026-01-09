'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import InfoCard from '../../components/InfoCard';
import { verificacion } from '../../lib/auth';
import { User } from '@/app/lib/types';
import { actualizarEstudiante } from '../../lib/servicios/estudiantes';

export default function PerfilEstudiantePage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    matricula: '',
    nombre: '',
    apellidos: '',
    correo: ''
  });

  useEffect(() => {
    verificarYCargarUsuario();
  }, [router]);

  const verificarYCargarUsuario = async () => {
    const { autenticado, usuario: user } = await verificacion();

    if (!autenticado) {
      alert('Sesión expirada. Por favor inicia sesión nuevamente.');
      router.push('/');
      return;
    }

    setUsuario(user);
    inicializarFormulario(user);
    setLoading(false);
  };

  const inicializarFormulario = (user: User) => {
    setFormData({
      matricula: user.matricula?.toString() || '',
      nombre: user.nombre || '',
      apellidos: user.apellidos || '',
      correo: user.correo || ''
    });
  };

  const manejarCambio = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const activarEdicion = () => {
    setModoEdicion(true);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    if (usuario) {
      inicializarFormulario(usuario);
    }
  };

  const guardarCambios = async () => {
    if (!usuario) return;

    try {
      const usuarioActualizado: User = {
        ...usuario,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo
      };

      const { ok, data } = await actualizarEstudiante({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.correo,
        matricula: usuario.matricula
      });

      if (!ok) {
        alert("Error al realizar la acción, intentalo mas tarde");
        return;
      }

      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
      setModoEdicion(false);
      alert('Información actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error de conexión. Intenta de nuevo.');
    }
  };

 

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header  />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/estudiante/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium transition"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Regresar al Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            
            <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Información del Estudiante</h1>
                  <p className="text-indigo-100 mt-1">Datos personales y de acceso</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                
                {modoEdicion ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={manejarCambio}
                      className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                ) : (
                  <InfoCard
                    label="Nombre"
                    value={usuario.nombre}
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    }
                  />
                )}

                
                {modoEdicion ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={manejarCambio}
                      className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                ) : (
                  <InfoCard
                    label="Apellidos"
                    value={usuario.apellidos}
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  />
                )}

                
                <InfoCard
                  label="Matrícula"
                  value={usuario.matricula}
                  icon={
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  }
                />

                
                {modoEdicion ? (
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
                    <label className="block text-sm font-medium text-gray-600 mb-2">Correo</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={manejarCambio}
                      className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>
                ) : (
                  <InfoCard
                    label="Correo"
                    value={usuario.correo}
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                )}
              </div>

             
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                {modoEdicion ? (
                  <>
                    <button 
                      onClick={guardarCambios}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Guardar Cambios</span>
                    </button>
                    <button 
                      onClick={cancelarEdicion}
                      className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancelar</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={activarEdicion}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Editar Información</span>
                  </button>
                )}
              </div>
              <p className='text-gray-500 p-5 '>NOTA: SE PUEDE CAMBIAR NOMBRE Y APELLIDOS YA QUE ES UNA PRUEBA TECNICA Y NO ESTA ENFOCADA EN UN DESARROLLO EN PRODUCCION CON MAS USUARIOS</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
