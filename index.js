import { servidor, connection } from './config.js';
import { validaciones } from './funciones/validaciones.js';
import { loginUsuario } from './funciones/loginUsuario.js';
import { protegerRuta } from './funciones/protegerRuta.js';


servidor.get('/registro', (req, res) => {
  res.render("registro.hbs", { titulo: "Registro" });
});

servidor.post("/registro", validaciones);

servidor.get('/login', (req, res) => {
  res.render("login.hbs", { titulo: "Login" });
});


servidor.post('/login', loginUsuario);

servidor.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});


servidor.get('/',protegerRuta, async (req, res) => {
  try {
    //filtra los juegos por el usuario logueado
    const [juegos] = await connection.query('SELECT * FROM juegos WHERE usuario_id = ?', [req.session.usuario.id]);
    res.render("index.hbs", { titulo: "Zteam", juegos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
 
});

servidor.get('/nuevo',protegerRuta, (req, res) => {
  res.render("form.hbs", { titulo: "Nuevo Juego", action: "/nuevo", boton: "Crear", juego: { } });
});

servidor.post('/nuevo', protegerRuta, async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen } = req.body;
        const usuario_id = req.session.usuario.id;

        await connection.query(
            'INSERT INTO juegos (nombre, descripcion, precio, imagen, usuario_id) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, imagen, usuario_id]
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error al crear juego");
    }
});


servidor.get('/:id', protegerRuta, async (req, res) => {
    try {
        const [juegos] = await connection.query('SELECT * FROM juegos WHERE id = ?', [req.params.id]);
        const juego = juegos[0];
        if (!juego) return res.send("No encontrado");
        res.render("detalle.hbs", { titulo: juego.titulo, juego }); 
    } catch (error) {
        console.error(error);
        res.send("Error al cargar el juego");
    }
});

servidor.get('/:id/editar', protegerRuta, async (req, res) => {
    try {
        const [juegos] = await connection.query('SELECT id, nombre, descripcion, precio, imagen FROM juegos WHERE id = ?', [req.params.id]);
        const juego = juegos[0];
        if (!juego) return res.send("No encontrado");
        res.render("form.hbs", { titulo: "Editar Juego", action: `/${juego.id}/editar`, boton: "Guardar", juego }); 
    } catch (error) {
        console.error(error);
        res.send("Error al cargar el juego");
    }
  });

servidor.post('/:id/editar', protegerRuta, async (req, res) => {
    try {
        const { nombre, descripcion, precio, imagen } = req.body;
        await connection.query(
            'UPDATE juegos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?',
            [nombre, descripcion, precio, imagen, req.params.id]
        );
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error al editar juego");
    }
});

servidor.post('/:id/borrar', protegerRuta, async (req, res) => {
    try {
        await connection.query('DELETE FROM juegos WHERE id = ?', [req.params.id]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error al borrar juego");
    }
});

