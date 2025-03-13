import Joi from 'joi';

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const user_insert_schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(6).max(12).required(),
});

export const login_schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().alphanum().min(6).max(12).required(),
});

export const task_insert_schema = Joi.object({
  id_usuario: Joi.string().required(),
  titulo: Joi.string().required(),
  descripcion: Joi.string().required(),
  fecha_limite: Joi.date().required(),
  estado: Joi.string().valid('PENDIENTE', 'COMPLETADA').required(),
  categoria: Joi.string().valid('TRABAJO', 'PERSONAL', 'ESTUDIO').required()
});

export const task_schema = Joi.object({
  id_usuario: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  }),
  id_tarea: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  })
});

export const file_insert_schema = Joi.object({
  id_usuario: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  }),
  id_tarea: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  })
});

export const file_schema = Joi.object({
  id_archivo: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  }),
  id_usuario: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  }),
  id_tarea: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  })
});

export const filter_category_schema = Joi.object({
  id_usuario: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  }),
  filtro: Joi.string().valid('TRABAJO', 'PERSONAL', 'ESTUDIO').required()
});

export const filter_state_schema = Joi.object({
  id_usuario: Joi.string().pattern(objectIdRegex).required().messages({
    'string.pattern.base': 'El ID debe ser un ObjectId válido de MongoDB'
  }),
  filtro: Joi.string().valid('PENDIENTE', 'COMPLETADA').required()
});