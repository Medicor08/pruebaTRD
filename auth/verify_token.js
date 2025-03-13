import jwt from 'jsonwebtoken';

export const verify_token = (req, res, next) => {
    try {
        //Se obtiene el token del header
        const token = req.header('Authorization')?.split(' ')[1];

        //Se valida si contiene información
        if (!token) {
            return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
        }

        //Se valida que el token sea correcto
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            req.user = decoded;
            next();
        });

    } catch (e) {
        res.send(e);
    }
};