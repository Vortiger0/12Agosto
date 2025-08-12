import { servidor } from './config.js';
//lo de abajo es una ruta para la pagina principal
servidor.get('/', (req, res) => {
    res.send('Hello World!');
});
