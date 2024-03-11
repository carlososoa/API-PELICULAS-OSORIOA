const { Schema, model } = require('mongoose')

const GeneroSchema = new Schema({
  nombre: { type: String, required: true },
  estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
  fechaCreacion: { type: Date, required: true },
  fechaActualizacion: { type: Date, required: true },
  descripcion: { type: String, required: true }

})

module.exports = model('Generos', GeneroSchema)
