import express from 'express';
import * as userController from '../controllers/users_controller.js';
import * as taskController from '../controllers/tasks_controller.js';
import * as filesController from '../controllers/files_controller.js';
import * as filterController from '../controllers/filter_controller.js';
import { login } from '../auth/login.js';
import { verify_token } from '../auth/verify_token.js';
import { check_user_id } from '../utils/check_user_id.js'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 2 * 1024 * 1024 } }).single('archivo');
const router = express.Router();

//Registro de usuarios
router.post('/usuarios', userController.insertar_usuarios);

//Login
router.post('/login', login);

//Crear tarea
router.post('/tareas', verify_token, check_user_id, taskController.task_insert);

//Listar tareas
router.get('/tareas', verify_token, check_user_id, taskController.tasks_users);

//Ver detalle de una tarea
router.get('/tareas/detalle', verify_token, check_user_id, taskController.task_detail);

//Actualizar tarea
router.put('/tareas', verify_token, check_user_id, taskController.task_update);

//Eliminar tarea
router.delete('/tareas', verify_token, check_user_id, taskController.task_delete);

/*Adjuntar archivo a tarea
    validar tipo de archivo (imagen, pdf)
    Límite máximo 2mb
*/
router.post('/archivos', verify_token, check_user_id, upload, filesController.upload_file);

//Descargar archivo
router.get('/archivos', verify_token, check_user_id, filesController.download_file);

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de tamaño de archivo
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es 2MB.' });
    }
    // Otros errores de Multer
    return res.status(500).json({ message: 'Hubo un error con la carga del archivo.', error: err.message });
  } else if (err) {
    // Otros errores generados en la aplicación
    return res.status(500).json({ message: 'Hubo un error al procesar la solicitud.', error: err.message });
  }
  next(); // Si no hay errores, pasa al siguiente middleware o ruta
});

//Eliminar archivo
router.delete('/archivos', verify_token, check_user_id, filesController.delete_file);

//Filtro por categoria
router.get('/tareas/filtradas-categoria', verify_token, check_user_id, filterController.filter_category);

//Filtro por estado
router.get('/tareas/filtradas-estado', verify_token, check_user_id, filterController.filter_state);

export default router;