'use client';

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function UserMenu() {
    const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  function logout(){
    localStorage.removeItem("token");
    router.push("/");
  }
  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex cursor-pointer items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {menuOpen && (
        <div className="absolute left-[-100] mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <Link href="/estudiante/perfil" className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 block">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-700">Ver información</span>
          </Link>
          <button onClick={logout}  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 border-t block">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-red-600">Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
