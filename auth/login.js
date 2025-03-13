import { Mongoclient } from '../utils/mongodb_connection.js';
import { sql } from '../utils/postgresql_connection.js'
import jwt from 'jsonwebtoken';
import { comparePassword } from '../utils/compare_pass.js';
import { login_schema } from '../utils/schemas.js';

export async function login(req, res) {
    try {
        //Validacion de esquema
        const { error } = login_schema.validate(req.body);

        if (error)
            return res.status(400).json({ error: error.details[0].message });

        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('usuarios');
        const checkUser = await collection.findOne({ email: req.body.email });

        //Se valida que el usuario exista
        if (!checkUser)
            return res.status(400).json({ mensaje: "Usuario no encontrado" });

        //Se valida que las contraseñas coincidan
        if (await comparePassword(req.body.password, checkUser.password) === 1)
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });

        const payload = { user_id: checkUser._id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token: token });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Error al hacer login" });
    } finally {
        await Mongoclient.close();
    }
}