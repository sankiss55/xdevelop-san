-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 09, 2026 at 05:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xdevelop`
--

-- --------------------------------------------------------

--
-- Table structure for table `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `autor` varchar(150) NOT NULL,
  `identificador` varchar(50) NOT NULL,
  `genero` varchar(100) DEFAULT NULL,
  `anio_publicacion` int(11) DEFAULT NULL,
  `registrado_por` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `libros`
--

INSERT INTO `libros` (`id`, `titulo`, `autor`, `identificador`, `genero`, `anio_publicacion`, `registrado_por`, `created_at`, `updated_at`) VALUES
(21, 'Cien años de soledad', 'Gabriel García Márquez', '978-0307474728', 'Literatura', 1967, 2, '2026-01-08 07:17:54', '2026-01-08 19:46:44'),
(22, 'Código Limpio (Clean Code)', 'Robert C. Martin', '978-8441526945', 'Programación', 2009, 2, '2026-01-08 07:17:54', '2026-01-08 19:49:28'),
(23, 'El amor en los tiempos del cólera', 'Gabriel García Márquez', '978-0307387738', 'Literatura', 1985, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(24, 'El algoritmo de la felicidad', 'Mo Gawdat', '978-8417030315', 'Ciencia', 2017, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(25, 'Patrones de Diseño', 'Erich Gamma', '978-8478290284', 'Programación', 1994, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(26, 'Don Quijote de la Mancha', 'Miguel de Cervantes', '978-8424116286', 'Literatura', 2004, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(28, 'Crónica de una muerte anunciada', 'Gabriel García Márquez', '978-1400034956', 'Literatura', 1981, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(29, 'Refactorización', 'Martin Fowler', '978-8441541917', 'Programación', 1999, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(30, 'La ciudad y los perros', 'Mario Vargas Llosa', '978-6124128585', 'Literatura', 1963, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(31, 'Cosmos', 'Carl Sagan', '978-8408095071', 'Ciencia', 1980, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(32, 'Pedro Páramo', 'Juan Rulfo', '978-8437601656', 'Literatura', 1955, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(33, 'El programador pragmático', 'Andrew Hunt', '978-8441542617', 'Programación', 1999, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(34, 'Sapiens: De animales a dioses', 'Yuval Noah Harari', '978-8466342247', 'Historia', 2011, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(35, 'La casa de los espíritus', 'Isabel Allende', '978-0307474308', 'Literatura', 1982, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(36, 'Rayuela', 'Julio Cortázar', '978-8437604572', 'Literatura', 1963, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(37, 'Introducción a la Teoría de la Computación', 'Michael Sipser', '978-6074810431', 'Tecnología', 2005, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(38, 'El Aleph', 'Jorge Luis Borges', '978-8420633114', 'Literatura', 1949, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(39, 'El origen de las especies', 'Charles Darwin', '978-8437601441', 'Ciencia', 1859, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54'),
(40, 'Ficciones', 'Jorge Luis Borges', '978-8420633138', 'Literatura', 1944, 2, '2026-01-08 07:17:54', '2026-01-08 07:17:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `matricula` varchar(20) NOT NULL,
  `correo` varchar(225) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo` varchar(10) NOT NULL DEFAULT 'usuario' CHECK (`tipo` in ('usuario','admin')),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nombre`, `apellidos`, `matricula`, `correo`, `password`, `tipo`, `created_at`, `updated_at`) VALUES
(2, 'admin', 'prueba', '12', 'admin@admin', '$2b$10$GYv2mKgCgBLOUlVcAFMUPuMKxUQLSkfGfnDHpcxJxeXyUQvAm6bIm', 'admin', '2026-01-08 07:16:09', '2026-01-08 21:06:15'),
(3, 'juan santiago', 'vera sanchez', '123', 'sanchezvera490c@gmail.com', '$2b$10$GYv2mKgCgBLOUlVcAFMUPuMKxUQLSkfGfnDHpcxJxeXyUQvAm6bIm', 'usuario', '2026-01-08 20:59:05', '2026-01-08 20:59:05'),
(4, 'juan santiago', 'vera sanchez', '121', 'sanchezvera490@gmail.com', '$2b$10$8oyIvhwLpDCooeQK79yDhe8mZ.WANHH9af8UN7mv6vXW8JSJoe71q', 'usuario', '2026-01-08 20:59:23', '2026-01-08 20:59:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identificador` (`identificador`),
  ADD KEY `fk_admin_libro` (`registrado_por`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `matricula` (`matricula`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `fk_admin_libro` FOREIGN KEY (`registrado_por`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
