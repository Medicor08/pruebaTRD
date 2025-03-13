import { Mongoclient } from '../utils/mongodb_connection.js'
import { user_insert_schema } from '../utils/schemas.js'
import { hashPassword } from '../utils/encrypt_pass.js'


//Insertar usuarios
export async function insertar_usuarios(req, res) {
    try {
        //Validacion de esquema
        const { error } = user_insert_schema.validate(req.body);

        if (error)
            return res.status(400).json({ error: error.details[0].message });

        //Se valida si el correo ya está registrado
        await Mongoclient.connect();
        const db = Mongoclient.db('TRD');
        const collection = db.collection('usuarios');

        const checkEmail = await collection.findOne({ email: req.body.email });

        if (checkEmail)
            return res.status(400).json({ mensaje: "Este correo ya está registrado" })

        await collection.insertOne({
            name: req.body.name,
            email: req.body.email,
            password: await hashPassword(req.body.password)
        });

        res.status(201).json({ mensaje: "Usuario creado exitosamente" });
    } catch (e) {
        console.log(e);
        res.status(400).json({ mensaje: "Error al crear usuario" });
    } finally {
        await Mongoclient.close();
    }
}