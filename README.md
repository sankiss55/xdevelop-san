## XDevelop - Biblioteca Virtual Estudiantil

Proyecto desarrollado con Next.js y API RESTful para gestionar una biblioteca digital orientada a estudiantes y administradores, con autenticación mediante JWT.

Dominio en producción: https://xdevelop-san.vercel.app/

---

## 1. Descripción del Proyecto

### Problemática planteada

En la institución, los estudiantes tienen dificultades para localizar libros y editoriales específicas de forma rápida. El registro de nuevos títulos por parte del personal administrativo es lento y propenso a errores manuales, lo que retrasa la disponibilidad de materiales para los alumnos.

### Objetivo general

Desarrollar una API RESTful para una biblioteca virtual que centralice la búsqueda de materiales y automatice el registro de libros mediante el análisis de archivos de datos.

### Objetivos específicos

- Implementar un sistema de autenticación seguro mediante JWT para diferenciar perfiles de Alumno y Administrador.
- Desarrollar un motor de búsqueda con filtros para optimizar la consulta de libros y editoriales.
- Automatizar la carga masiva de datos mediante la extracción de información desde archivos Excel.



---

## 2. Arquitectura y Tecnologías

- Frontend y API: Next.js (App Router)
- API RESTful con rutas en /api (login, verificación, estudiantes, libros)
- Autenticación: JWT (JSON Web Tokens)
- Base de datos: Azure Database for MySQL
- Despliegue del proyecto: Vercel

La documentación resumida de los endpoints de la API se encuentra en el archivo api-docs.txt en la raíz del proyecto.

---

## 3. Descarga e Instalación Local

### Requisitos previos

- Node.js 18 o superior
- npm o yarn
- Acceso a una base de datos MySQL (el archivo de la sql esta en la carpeta 'app/src/database')

### Pasos para clonar y ejecutar

1. Clonar o descargar este repositorio en tu máquina local:

	```bash
	git clone <URL_DEL_REPOSITORIO>
	cd xdevelop
	```

2. Instalar dependencias:

	```bash
	npm install
	```

3. Crear un archivo .env en la raíz del proyecto con, al menos, las siguientes variables (ajusta a tu entorno):

	```env
	HOST=<host_de_mysql>
	USER=<usuario_de_mysql>
	PASSWORD=<password_de_mysql>
	DATABASE=<nombre_de_base_de_datos>
	JWT_KEY_SECRET=<clave_secreta_para_jwt>
	```

4. Ejecutar el servidor de desarrollo:

	```bash
	npm run dev
	```

5. Abrir en el navegador:

	http://localhost:3000

---

## 4. Uso en la Nube (Producción)

### Base de datos en Azure

- Se utiliza Azure Database for MySQL como motor de base de datos.
- Las credenciales de conexión se configuran mediante variables de entorno (HOST, USER, PASSWORD, DATABASE) tanto en desarrollo como en Vercel.

### Despliegue en Vercel

El backend (APIs) y el frontend Next.js están desplegados en Vercel.

Flujo general para desplegar:

1. Crear un nuevo proyecto en Vercel y vincularlo al repositorio del proyecto.
2. Configurar en Vercel las mismas variables de entorno que se usan en .env (HOST, USER, PASSWORD, DATABASE, JWT_KEY_SECRET).
3. Realizar el deploy desde Vercel (build y despliegue automáticos tras los push al repositorio).
4. Acceder a la aplicación en el dominio asignado (en este caso: https://xdevelop-san.vercel.app/).

---

## 5. Roles y Credenciales de Prueba

El sistema diferencia dos perfiles principales:

- Alumno: Acceso a consulta de libros y a su propio perfil.
- Administrador: Gestión completa de libros (CRUD) y lectura de documentos excel para autocompletar información.

### Usuarios de prueba (solo para desarrollo)

- Administrador:
  - Matrícula: 123
  - Contraseña: sasasa

- Alumno:
  - Matrícula: 121
  - Contraseña: sasasa


---

## 6. Funcionalidades Clave

### Gestión de usuarios

- Registro e inicio de sesión con validación de matrícula y correo institucional.
- Perfil de usuario: consulta y actualización de datos básicos (nombre, apellidos, correo).

### Gestión de libros

- CRUD completo de libros (crear, leer, actualizar y eliminar) accesible para el rol Administrador.
- Campos básicos: título, autor, identificador, género, año de publicación.

### Autenticación y seguridad

- Autenticación basada en JWT con verificación de token para proteger rutas.
- Estructura preparada para middleware que restrinja el acceso según el rol del usuario.

### Búsqueda y carga desde archivos

- Motor de búsqueda con filtros (por texto, editorial o género) planeado para optimizar la consulta de libros.
- Procesamiento de archivos Excel para extracción de información de libros y autocompletar campos con dicha informacón.

---

## 7. Documentación de la API

Para una descripción rápida de los endpoints disponibles (rutas, métodos y propósito), revisar el archivo:

- api-docs.txt
