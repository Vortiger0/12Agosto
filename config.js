import express from 'express';
import hbs from 'hbs';
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise';


const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Zteam'
});

console.log('Conexión exitosa a la base de datos');

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicPath = path.join(__dirname, "public");
const servidor = express()

servidor.use(express.static(publicPath));
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

let pagina = path.join(__dirname, "views");
servidor.set("views", pagina);
servidor.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, '/views/partials'));

servidor.listen(4000);

export {
    servidor,
    connection
}