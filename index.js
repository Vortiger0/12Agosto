import { servidor } from './config.js';
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

let juegos = [
  { id: 1, nombre: "Juego 1", precio: 650, descripcion: "Descripción 1", imagen: "/imagenes/zteam.png" },
  { id: 2, nombre: "Juego 2", precio: 800, descripcion: "Descripción 2", imagen: "/imagenes/zteam.png" },
  { id: 3, nombre: "Juego 3", precio: 900, descripcion: "Descripción 3", imagen: "/imagenes/zteam.png" },
  { id: 4, nombre: "Juego 4", precio: 1000, descripcion: "Descripción 4", imagen: "/imagenes/zteam.png" },
  { id: 5, nombre: "Juego 5", precio: 1100, descripcion: "Descripción 5", imagen: "/imagenes/zteam.png" }
];

servidor.get('/',protegerRuta, (req, res) => {

  res.render("index.hbs", { titulo: "Zteam", juegos  }); 
 
});

servidor.get('/nuevo',protegerRuta, (req, res) => {
  //cuando se envia el formulario el navegador hace un post a /nuevo
  //juego corresponde a lo de form.hbs
  res.render("form.hbs", { titulo: "Nuevo Juego", action: "/nuevo", boton: "Crear", juego: {} });
});

servidor.post('/nuevo',protegerRuta, (req, res) => {
  //el id se genera con los milisegundos actuales
  const nuevo = { ...req.body, id: Date.now() };
  //se agrega el objeto "nuevo" al array de juegos
  //el cual contiene los datos del req.body y un id único
  juegos.push(nuevo);
  res.redirect('/');
});

servidor.get('/perfil',protegerRuta, (req, res) => {
  res.render('perfil', { titulo: 'Perfil' });
});

//se define una ruta con un parámetro dinámico :id
//eso significa que si el usuario accede a /1 o /3, express extrae ese valor de la url y lo
//guarda en req.params, que es un objeto de js.  
servidor.get('/:id',protegerRuta, (req, res) => {
  //busca dentro del array juegos el primer objeto cuyo id coincida con el id de la url (req.params.id)
  //cuando lo encuentra devuelve ese objeto, de lo contrario devuelve "no encontrado"
  const juego = juegos.find(j => j.id == req.params.id);
  if (!juego) return res.send("No encontrado");
  res.render("detalle.hbs", { titulo: juego.nombre, juego }); 
});
//muestra el formulario para editar un juego según su id
servidor.get('/:id/editar',protegerRuta, (req, res) => {
  const juego = juegos.find(j => j.id == req.params.id);
  if (!juego) return res.send("No encontrado");
  res.render("form.hbs", { titulo: "Editar Juego", action: `/${juego.id}/editar`, boton: "Guardar", juego }); 
});
//post que recibe los datos editados del formulario
servidor.post('/:id/editar',protegerRuta, (req, res) => {
  //busca la posicion en el array del juego con el id correspondiente
  const i = juegos.findIndex(j => j.id == req.params.id);
  //si no lo encuentra (findIndex devuelve -1) y muestra el mensaje
  if (i < 0) return res.send("No encontrado");
  //actualiza el juego con los nuevos datos
  //lo hace combinando ...juegos[i]: todas las propiedades actuales del juego
  //con ...req.body: las propiedades recibidas del formulario (sobrescriben las actuales)
  juegos[i] = { ...juegos[i], ...req.body };
  res.redirect('/');
});

servidor.post('/:id/borrar',protegerRuta, (req, res) => {
  //se crea un nuevo array en el cual se quedarán
  //los juegos cuyos id no coincidan con el que viene en req.params.id, este último será el borrado
  juegos = juegos.filter(j => j.id != req.params.id);
  res.redirect('/');
});

