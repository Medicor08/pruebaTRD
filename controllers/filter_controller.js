import { Mongoclient } from '../utils/mongodb_connection.js'
import { filter_category_schema, filter_state_schema } from '../utils/schemas.js'

export async function filter_category(req, res) {
    try {
        const { error } = filter_category_schema.validate(req.query);

        if (error)
            return res.status(400).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const tasks = await db.collection('tareas').find({ categoria: req.query.filtro }).toArray();

        res.json({ tareas: tasks });
    } catch (e) {
        console.log(e);
        res.status(400).json({ mensaje: "Hubo un error al filtrar por categoria" });
    } finally {
        await Mongoclient.close()
    }
};

export async function filter_state(req, res) {
    try {
        const { error } = filter_state_schema.validate(req.query);

        if (error)
            return res.status(400).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const tasks = await db.collection('tareas').find({ estado: req.query.filtro }).toArray();

        res.json({ tareas: tasks });
    } catch (e) {
        console.log(e);
        res.status(400).json({ mensaje: "Hubo un error al filtrar por estado" });
    } finally {
        await Mongoclient.close()
    }
};