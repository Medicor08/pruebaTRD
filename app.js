import express from 'express'
import routes from './router/routes.js';
import multer from 'multer';
const app = express()

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
app.listen(PORT, () => { console.log(`Servicio iniciado en puerto ${PORT}`) });