import { Mongoclient } from '../utils/mongodb_connection.js'
import { ObjectId } from 'mongodb'
import { task_insert_schema, task_schema } from '../utils/schemas.js'

export async function task_insert(req, res) {
    try {
        const { error } = task_insert_schema.validate(req.body);
        if (error)
            return res.status(401).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('tareas');

        const insert = await collection.insertOne({
            id_usuario: ObjectId.createFromHexString(req.body.id_usuario),
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            fecha_limite: req.body.fecha_limite,
            estado: req.body.estado,
            categoria: req.body.categoria
        });

        res.status(201).json({
            mensaje: "Tarea creada con éxito", tarea: { _id: insert.insertedId, ...req.body }
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error al crear tarea" });
    } finally {
        await Mongoclient.close();
    }
}

export async function tasks_users(req, res) {
    try {
        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('tareas');

        const tasks = await collection.find().toArray()
        res.json({ tareas: tasks })
    } catch (e) {
        console.log(e)
        res.status(400).json({ error: "Error al listar las tareas del usuario" });
    }
}

export async function task_detail(req, res) {
    try {
        const { error } = task_schema.validate(req.query);
        if (error)
            return res.status(401).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('tareas');

        if (!ObjectId.isValid(req.query.id_tarea))
            return res.status(400).json({ mensaje: "El id de la tarea no es válido" });

        const task_detail = await collection.findOne({ _id: ObjectId.createFromHexString(req.query.id_tarea) })

        if (!task_detail)
            return res.status(400).json({ mensaje: "No se encontró la tarea" });

        res.json({ task_detail });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error al obtener tarea detallada" })
    } finally {
        await Mongoclient.close();
    }
}

export async function task_update(req, res) {
    try {
        const { error } = task_schema.validate(req.query);
        if (error)
            return res.status(401).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('tareas');

        const filter = { _id: ObjectId.createFromHexString(req.query.id_tarea) };
        const newData = { $set: { ...req.body } };
        const updated_task = await collection.updateOne(filter, newData)

        if (updated_task.matchedCount < 1)
            return res.status(400).json({ mensaje: "No se encontró la tarea" });

        res.json({ mensaje: "Tarea actualizada", datos_modificados: { ...req.body } });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error al actualizar la tarea" });
    } finally {
        await Mongoclient.close()
    }
}

export async function task_delete(req, res) {
    try {
        const { error } = task_schema.validate(req.query);
        if (error)
            return res.status(401).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('tareas');

        const deleted_task = await collection.deleteOne({ _id: ObjectId.createFromHexString(req.query.id_tarea) })

        if (deleted_task.deletedCount < 1)
            return res.status(400).json({ mensaje: "No se encontró la tarea" })

        res.json({ mensaje: "Tarea eliminada", id: req.query.id_tarea });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error al eliminar la tarea" });
    } finally {
        await Mongoclient.close()
    }
}