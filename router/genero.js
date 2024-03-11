const { Router } = require('express')
const Genero = require('../models/Genero.js')
const { validationResult, check } = require('express-validator')

const router = Router()

router.post('/', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
  check('descripcion', 'invalid.descripcion').not().isEmpty()]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      const existeGenero = await Genero.findOne({ nombre: req.body.nombre })
      if (existeGenero) {
        return res.status(400).send('Este genero ya existe')
      }

      let genero = new Genero()
      genero.nombre = req.body.nombre
      genero.estado = req.body.estado
      genero.descripcion = req.body.descripcion
      genero.fechaCreacion = new Date()
      genero.fechaActualizacion = new Date()

      genero = await genero.save()

      res.send(genero)
      console.log('hola desde /genero')
    } catch (error) {
      console.log(error)
    }
  })

router.get('/', (req, res) => {
  Genero
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

router.put('/:generoId', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
  check('descripcion', 'invalid.descripcion').not().isEmpty()]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      let genero = await Genero.findById(req.params.generoId)
      if (!genero) {
        return res.status(400).send('Genero no existe')
      }

      const existeGenero = await Genero.findOne({ nombre: req.body.nombre, _id: { $ne: genero._id } })
      if (existeGenero) {
        return res.status(400).send('Este genero ya existe')
      }

      genero.nombre = req.body.nombre
      genero.estado = req.body.estado
      genero.descripcion = req.body.descripcion
      genero.fechaActualizacion = new Date()

      genero = await genero.save()

      res.send(genero)
      console.log('hola desde /genero')
    } catch (error) {
      console.log(error)
      res.status(500).send('Ocurrio un error al actualizar el genero')
    }
  })

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Genero
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

module.exports = router
