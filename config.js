import express from 'express'; 
import hbs from 'hbs';
import path from 'path'
import { fileURLToPath } from 'url' 
import mysql from 'mysql2/promise'; 
import session from 'express-session'; 
import MySQLStoreFactory from 'express-mysql-session';
import dotenv from 'dotenv';

dotenv.config();


const dbConfig = {
  host: 'localhost',
  user: process.env.user,
  password: process.env.contra,
  database: process.env.DB,
  port: process.env.port
};

const connection = await mysql.createConnection(dbConfig);
console.log('Conexión exitosa a la base de datos');

const MySQLStoreSession = MySQLStoreFactory(session);
const sessionStore = new MySQLStoreSession(dbConfig);

const __filename = fileURLToPath(import.meta.url) 
const __dirname = path.dirname(__filename) 
const publicPath = path.join(__dirname, "public"); 
const servidor = express() 


servidor.use(express.static(publicPath)); //para servir archivos estáticos desde la carpeta public
servidor.use(express.json()); //para leer datos en formato json
servidor.use(express.urlencoded({ extended: true })); //para poder leer datos de formularios
servidor.use(express.static(path.join(__dirname,"node_modules/bootstrap/dist")));


servidor.use(session({
    key: process.env.key, //nombre de la cookie de sesión
    store: sessionStore, //almacenamiento de sesiones en la base de datos
    secret: process.env.SESSION_SECRET, //clave secreta para firmar la cookie de sesión
    resave: false, // no guarda la sesión si el usuario no ha hecho cambios
    saveUninitialized: false, // en true crea la sesión sin login. En falso es necesario el login
    cookie: { maxAge: 86400000, 
      httpOnly: true //para evitar que la cookie sea accesible via js
     } 
}));


const pagina = path.join(__dirname, "views");
servidor.set("views", pagina);
servidor.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, '/views/partials'));


servidor.listen(80);

export {
    servidor,
    connection
}