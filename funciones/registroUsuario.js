import { connection } from "../config.js";

export async function insertarUsuario(nombre, correo, contra) {
    await connection.query(
      "INSERT INTO usuarios (nombre, correo, contra) VALUES (?, ?, ?)",
      [nombre, correo, contra]
    );


}