import bcrypt from "bcryptjs";
import { connection } from "../config.js";

export async function loginUsuario(req, res) {
  const { correo, contra } = req.body;

  try {
    // Buscar el usuario por su correo
    const [resultado] = await connection.query(
      "SELECT * FROM usuarios WHERE correo = ?",
      [correo]
    );

    // Si no existe el correo
    if (resultado.length === 0) {
      return res.render("login.hbs", { error: "Correo no registrado" });
    }

    const usuario = resultado[0];

    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(contra, usuario.contra);
    if (!contraseñaValida) {
      return res.render("login.hbs", { error: "Contraseña incorrecta" });
    }

    // Guardar información del usuario en la sesión
    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
    };

    res.redirect("/");

  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.render("login.hbs", { error: "Error interno en el servidor" });
  }
}
