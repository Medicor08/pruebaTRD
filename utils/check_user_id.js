export function check_user_id(req, res, next) {
    if (req.user.user_id != req.query.id_usuario)
        return res.status(400).json({ mensaje: "Usario no válido" })

    next()
}