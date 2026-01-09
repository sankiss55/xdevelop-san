'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';
import { verificacion } from '../../lib/auth';
import { User, Libro } from '@/app/lib/types';
import { obtenerLibros } from '../../lib/servicios/libros';
import { aplicarFiltros, obtenerGenerosUnicos } from '../../lib/utils/filtros';

export default function DashboardEstudiantePage() {
  const [busqueda, setBusqueda] = useState<string>('');
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(false);
  const [filtroGenero, setFiltroGenero] = useState<string>('');
  const [filtroAnio, setFiltroAnio] = useState<string>('');
  const [libros, setLibros] = useState<Libro[]>([]);

  useEffect(() => {
    cargarDatosIniciales();
  }, [router]);

  const cargarDatosIniciales = async () => {
    //verificacion de ruta para usuarios JWT
    const { autenticado, usuario: user } = await verificacion();

    if (!autenticado) {
      alert('Sesión expirada. Por favor inicia sesión nuevamente.');
      router.push('/');
      return;
    }

    await cargarLibros();
    setUsuario(user);
    setLoading(false);
  };

  const cargarLibros = async () => {
    try {
      const { ok, data } = await obtenerLibros();

      if (ok && data.success) {
        setLibros(data.libros || []);
      } else {
        console.error('Error al cargar libros:', data.message);
        setLibros([]);
      }
    } catch (error) {
      console.error('Error al cargar libros:', error);
      setLibros([]);
    }
  };

  const limpiarFiltros = (): void => {
    setFiltroGenero('');
    setFiltroAnio('');
    setBusqueda('');
  };

  const generosUnicos: string[] = obtenerGenerosUnicos(libros);
  const librosFiltrados: Libro[] = aplicarFiltros(libros, busqueda, filtroGenero, filtroAnio);

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
         
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar libros por título, autor o género..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filtros</span>
            {(filtroGenero || filtroAnio) && (
              <span className="ml-2 bg-white text-indigo-600 rounded-full px-2 py-0.5 text-xs font-bold">
                {(filtroGenero ? 1 : 0) + (filtroAnio ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {mostrarFiltros && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filtrar por:</h3>
              <button
                onClick={limpiarFiltros}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  value={filtroGenero}
                  onChange={(e) => setFiltroGenero(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="">Todos los géneros</option>
                  {generosUnicos.map(genero => (
                    <option key={genero} value={genero}>{genero}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de Publicación
                </label>
                <input
                  type="number"
                  placeholder="Ej: 1967"
                  value={filtroAnio}
                  onChange={(e) => setFiltroAnio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            {(filtroGenero || filtroAnio) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Filtros activos:</p>
                <div className="flex flex-wrap gap-2">
                  {filtroGenero && (
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      Género: {filtroGenero}
                      <button
                        onClick={() => setFiltroGenero('')}
                        className="ml-2 hover:text-indigo-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                  {filtroAnio && (
                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      Año: {filtroAnio}
                      <button
                        onClick={() => setFiltroAnio('')}
                        className="ml-2 hover:text-purple-900"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-2xl font-bold text-white">Catálogo de Libros Disponibles</h2>
            <p className="text-indigo-100 mt-1">Total de libros: {librosFiltrados.length}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Título</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Autor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Identificador</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Género</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Año Publicación</th>
                
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {librosFiltrados.map((libro) => (
                  <tr key={libro.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{libro.titulo}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{libro.autor}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                        {libro.identificador}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{libro.genero}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{libro.anio_publicacion}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {librosFiltrados.length === 0 && (
            <div className="px-6 py-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg">No se encontraron libros con esos criterios</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
