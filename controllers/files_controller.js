import { Mongoclient } from '../utils/mongodb_connection.js'
import { ObjectId } from 'mongodb'

export async function upload_file(req, res) {
    try {
        if (!req.file)
            return res.status(400).json({ message: 'No se ha enviado ningún archivo.' });

        const tipos_archivos = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!tipos_archivos.includes(req.file.mimetype))
            return res.status(400).json({ mensaje: "Tipo de archivo no válido" });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');

        const task_exists = await db.collection('tareas').findOne({ _id: ObjectId.createFromHexString(req.query.id_tarea) });
        if (!task_exists)
            return res.status(400).json({ mensaje: "La tarea no existe" });

        const insert = await db.collection('archivos').insertOne({
            id_tarea: ObjectId.createFromHexString(req.query.id_tarea),
            nombre_archivo: req.file.originalname,
            tipo_archivo: req.file.mimetype,
            archivo: req.file.buffer
        });

        res.status(201).json({ mensaje: "Archivo insertado con éxito", archivo: { _id: insert.insertedId } });
    } catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Error al guardar el archivo' });
    } finally {
        await Mongoclient.close();
    }
};

export async function download_file(req, res) {
    try {
        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');

        const task_exists = await db.collection('tareas').findOne({ _id: ObjectId.createFromHexString(req.query.id_tarea) });
        if (!task_exists)
            return res.status(400).json({ mensaje: "La tarea no existe" });

        const file = await db.collection('archivos').findOne({ _id: ObjectId.createFromHexString(req.query.id_archivo) });

        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.nombre_archivo)}"`);
        res.setHeader('Content-Type', file.tipo_archivo);
        res.setHeader('Content-Length', file.archivo.buffer.length);
        res.send(file.archivo.buffer);
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: 'Error al recuperar el archivo' });
    } finally {
        await Mongoclient.close();
    }
};

export async function delete_file(req, res) {
    try {

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');

        const task_exists = await db.collection('tareas').findOne({ _id: ObjectId.createFromHexString(req.query.id_tarea) });
        if (!task_exists)
            return res.status(400).json({ mensaje: "La tarea no existe" });

        const deleted_task = await db.collection('archivos').deleteOne({ _id: ObjectId.createFromHexString(req.query.id_archivo) });

        if (deleted_task.deletedCount < 1)
            return res.status(400).json({ mensaje: "No se encontró el archivo" });

        res.json({ mensaje: "Archivo eliminado", id: req.query.id_archivo });
    } catch (e) {
        console.log(e);
        res.status(400).json({ mensaje: "Error al eliminar el archivo" });
    } finally {
        await Mongoclient.close();
    }
}



