//Conexion de base de datos (mysql) usando .env de forma segura
import mysql from "mysql2/promise"
export const conn= mysql.createPool({
    host: process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
})