const { Schema, model } = require('mongoose')

const MediaSchema = new Schema({
  serial: {
    type: String,
    required: true,
    unique: true
  },
  titulo: { type: String, required: true },
  sinopsis: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  imgPortada: { type: String, required: true },
  estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
  fechaCreacion: { type: Date, required: true },
  fechaActualizacion: { type: Date, required: true },
  anioEstreno: { type: String, required: true, min: 1890, max: 2024 },
  genero: {
    type: Schema.Types.ObjectId,
    ref: 'Generos',
    required: true
  },
  director: {
    type: Schema.Types.ObjectId,
    ref: 'Directores',
    required: true
  },
  productora: {
    type: Schema.Types.ObjectId,
    ref: 'Productoras',
    required: true
  },
  tipo: {
    type: Schema.Types.ObjectId,
    ref: 'Tipos',
    required: true
  }

})

module.exports = model('Medias', MediaSchema)
