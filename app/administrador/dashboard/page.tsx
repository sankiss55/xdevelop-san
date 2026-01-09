'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useRouter } from 'next/navigation';
import { verificacion } from '../../lib/auth';
import { User, Libro } from '@/app/lib/types';
import { 
  obtenerLibrosAdmin, 
  agregarLibro, 
  eliminarLibro, 
  actualizarLibroAdmin 
} from '@/app/lib/servicios/administrador';
import { 
  filtrarLibrosPorBusqueda, 
  inicializarFormularioEdicion, 
  limpiarFormulario,
  procesarCambioFormulario,
  procesarExcelAFormulario
} from '@/app/lib/utils/gestionLibros';
import readXlsxFile from 'read-excel-file';

type VistaType = 'formulario' | 'importar' | 'gestionar';

export default function DashboardAdministradorPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [vistaActual, setVistaActual] = useState<VistaType>('formulario'); 
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    identificador: '',
    genero: '',
    anio_publicacion: '',
  });

  const [libros, setLibros] = useState<Libro[]>([]);
  const [librosFiltrados, setLibrosFiltrados] = useState<Libro[]>([]);
  const [busqueda, setBusqueda] = useState<string>('');
  const [libroEditando, setLibroEditando] = useState<number | null>(null);
  const [formEditar, setFormEditar] = useState({
    titulo: '',
    autor: '',
    identificador: '',
    genero: '',
    anio_publicacion: '',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const { autenticado, usuario: user } = await verificacion();

      if (!autenticado) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        router.push('/');
        return;
      }
      if (user.tipo !== 'admin') {
        alert('No tienes permisos para acceder a esta página.');
        router.push('/');
        return;
      }
      setUsuario(user);
      setLoading(false);
    };

    cargarDatos();
  }, [router]);

  useEffect(() => {
    if (vistaActual === 'gestionar') {
      cargarLibros();
    }
  }, [vistaActual]);

  useEffect(() => {
    const filtrados = filtrarLibrosPorBusqueda(libros, busqueda);
    setLibrosFiltrados(filtrados);
  }, [busqueda, libros]);

  async function cargarLibros() {
    try {
      const data = await obtenerLibrosAdmin();
      if (data.success) {
        setLibros(data.libros);
        setLibrosFiltrados(data.libros);
      }
    } catch (error) {
      alert('Error al cargar los libros');
    }
  }

  function handleInputChange(e: any) {
    const { name, value } = e.target;
    setFormData(prev => procesarCambioFormulario(prev, name, value));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!usuario) return;
    
    try {
      const data = await agregarLibro(formData, usuario.id);
      if (!data.success) {
        alert(data.message);
        return;
      }
      alert("El libro se agrego correctamente");
      setFormData(limpiarFormulario());
    } catch (error) {
      alert(error);
    }
  }

  function handleFileUpload(e: any) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file && file.type!="application/pdf") {
      readXlsxFile(file).then((rows)=>{
        if (rows.length < 2) {
          alert("El archivo debe contener al menos 2 filas (encabezados y datos)");
          return;
        }
        
        const datosFormulario = procesarExcelAFormulario(rows);
        setFormData(datosFormulario);
        alert("Datos cargados del Excel correctamente");
      }).catch((error) => {
        console.error("Error al leer el archivo:", error);
        alert("Error al procesar el archivo Excel");
      });
    }else{
      alert("Revisa que el documento sea el adecuado y conforme al tipo requerido")
    }
  }

  async function handleEliminar(id: number, titulo: string) {
    if (!confirm(`¿Estás seguro de eliminar el libro "${titulo}"?`)) {
      return;
    }
    
    try {
      const data = await eliminarLibro(id);
      if (data.success) {
        alert('Libro eliminado correctamente');
        cargarLibros();
      } else {
        alert(data.message || 'Error al eliminar el libro');
      }
    } catch (error) {
      alert('Error al eliminar el libro');
    }
  }

  function handleEditarClick(libro: Libro) {
    setLibroEditando(libro.id);
    setFormEditar(inicializarFormularioEdicion(libro));
  }

  function handleCancelarEdicion() {
    setLibroEditando(null);
    setFormEditar(limpiarFormulario());
  }

  function handleInputChangeEditar(e: any) {
    const { name, value } = e.target;
    setFormEditar(prev => procesarCambioFormulario(prev, name, value));
  }

  async function handleGuardarEdicion(id: number) {
    try {
      const data = await actualizarLibroAdmin(id, formEditar);
      if (data.success) {
        alert('Libro actualizado correctamente');
        handleCancelarEdicion();
        cargarLibros();
      } else {
        alert(data.message || 'Error al actualizar el libro');
      }
    } catch (error) {
      alert('Error al actualizar el libro');
    }
  }

 

  if (!usuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header  />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona el catálogo de libros de la biblioteca</p>
        </div>
        <div className="mb-6 flex space-x-4 border-b-2 border-gray-200">
          <button
            onClick={() => setVistaActual('formulario')}
            className={`px-6 py-3 font-semibold cursor-pointer transition-all ${
              vistaActual === 'formulario'
                ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar Libro</span>
            </div>
          </button>
          
        
          
          <button
            onClick={() => setVistaActual('gestionar')}
            className={`px-6 py-3 cursor-pointer font-semibold transition-all ${
              vistaActual === 'gestionar'
                ? 'text-indigo-600 border-b-2 border-indigo-600 -mb-0.5'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Gestionar Libros</span>
            </div>
          </button>
        </div>
        {vistaActual === 'formulario' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Nuevo Libro</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Ej: Cien años de soledad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="autor"
                    value={formData.autor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Ej: Gabriel García Márquez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identificador <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="identificador"
                    value={formData.identificador}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Ej: LIB-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Selecciona un género</option>
                    <option value="Ficción">Ficción</option>
                    <option value="No Ficción">No Ficción</option>
                    <option value="Ciencia Ficción">Ciencia Ficción</option>
                    <option value="Fantasía">Fantasía</option>
                    <option value="Romance">Romance</option>
                    <option value="Misterio">Misterio</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Biografía">Biografía</option>
                    <option value="Historia">Historia</option>
                    <option value="Ciencia">Ciencia</option>
                    <option value="Poesía">Poesía</option>
                    <option value="Teatro">Teatro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de Publicación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="anio_publicacion"
                    value={formData.anio_publicacion}
                    onChange={handleInputChange}
                    required
                    min="1000"
                    max="2100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    placeholder="Ej: 1967"
                  />
                </div>



              
               
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(limpiarFormulario())}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Guardar Libro</span>
                </button>
              </div>
              
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => handleFileUpload(e)}
                        className="hidden"
                      />
                      <div className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span>Seleccionar Excel</span>
                      </div>
                    </label>
                    
                  </div>
            </form>
          </div>
        )}


        {vistaActual === 'gestionar' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por título, autor, identificador o género..."
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {librosFiltrados.length} libro(s) encontrado(s)
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {librosFiltrados.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p className="text-gray-500 text-lg">No se encontraron libros</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Identificador</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Título</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Autor</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Género</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Año</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {librosFiltrados.map((libro) => (
                        libroEditando === libro.id ? (
                          <tr key={libro.id} className="bg-indigo-50">
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="identificador"
                                value={formEditar.identificador}
                                onChange={handleInputChangeEditar}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="titulo"
                                value={formEditar.titulo}
                                onChange={handleInputChangeEditar}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="autor"
                                value={formEditar.autor}
                                onChange={handleInputChangeEditar}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <select
                                name="genero"
                                value={formEditar.genero}
                                onChange={handleInputChangeEditar}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              >
                                <option value="Ficción">Ficción</option>
                                <option value="No Ficción">No Ficción</option>
                                <option value="Ciencia Ficción">Ciencia Ficción</option>
                                <option value="Fantasía">Fantasía</option>
                                <option value="Romance">Romance</option>
                                <option value="Misterio">Misterio</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Biografía">Biografía</option>
                                <option value="Historia">Historia</option>
                                <option value="Ciencia">Ciencia</option>
                                <option value="Poesía">Poesía</option>
                                <option value="Teatro">Teatro</option>
                              </select>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                name="anio_publicacion"
                                value={formEditar.anio_publicacion}
                                onChange={handleInputChangeEditar}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleGuardarEdicion(libro.id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={handleCancelarEdicion}
                                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={libro.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{libro.identificador}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{libro.titulo}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">{libro.autor}</td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                {libro.genero}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">{libro.anio_publicacion}</td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleEditarClick(libro)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                  title="Editar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleEliminar(libro.id, libro.titulo)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                  title="Eliminar"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
