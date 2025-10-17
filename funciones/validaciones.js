import bcrypt from 'bcryptjs'; 
import validator from 'validator';
import { connection } from '../config.js';
import { insertarUsuario } from './registroUsuario.js';

export async function validaciones(req, res, next) {
const { nombre, correo, contra, repite_contra } = req.body;
  // validar nombre
  //.trim evita espacios en blanco al inicio y al final de un texto
  if (!nombre || nombre.trim().length === 0) {
    return res.render("registro.hbs", { titulo: "Registro", error: "Debes ingresar un nombre válido" });
  }

  // validar email
  if (!validator.isEmail(correo)) {
    return res.render("registro.hbs", { titulo: "Registro", error: "Debes ingresar un correo electrónico válido" });
  }
  // validar contraseña 
   if (!contra || contra.length < 6) {
    return res.render("registro.hbs", { titulo: "Registro", error: "Debes ingresar una contraseña válida" });
  }

  // validar repetición de contraseña
  if (contra !== repite_contra) {
    return res.render("registro.hbs", { titulo: "Registro", error: "Las contraseñas no coinciden" });
  }
 
  try {

    // verificar si el correo ya está registrado
    const [usuariosExistentes] = await connection.query(
    "SELECT * FROM usuarios WHERE correo = ?",
    [correo]
    );

    if (usuariosExistentes.length > 0) {
      return res.render("registro.hbs", { 
        titulo: "Registro", 
        error: "Este correo ya está registrado" 
      });
    }
    // encriptar contraseña
    const hash = await bcrypt.hash(contra, 10);

    // insertar en la base de datos
    await insertarUsuario(nombre,correo,hash);

    res.redirect('/login');

  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.render("registro.hbs", { titulo: "Registro", error: "El correo ya está en uso o error interno" });
  }
};