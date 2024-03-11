const { Router } = require('express')
const Tipo = require('../models/Tipo.js')
const { validationResult, check } = require('express-validator')

const router = Router()

router.post('/', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('descripcion', 'invalid.descripcion').not().isEmpty()]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      const existeTipo = await Tipo.findOne({ nombre: req.body.nombre })
      if (existeTipo) {
        return res.status(400).send('Este tipo ya existe')
      }

      let tipo = new Tipo()
      tipo.nombre = req.body.nombre
      tipo.descripcion = req.body.descripcion
      tipo.fechaCreacion = new Date()
      tipo.fechaActualizacion = new Date()

      tipo = await tipo.save()

      res.send(tipo)
      console.log('Tipo Creado Exitosamente')
    } catch (error) {
      console.log(error)
    }
  })

router.get('/', (req, res) => {
  Tipo
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

router.put('/:id', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('descripcion', 'invalid.descripcion').not().isEmpty()
]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      let tipo = await Tipo.findById(req.params.id)
      if (!tipo) {
        return res.status(400).send('Tipo no existe')
      }

      const existeTipo = await Tipo.findOne({ nombre: req.body.nombre, _id: { $ne: tipo._id } })
      if (existeTipo) {
        return res.status(400).send('Este Tipo ya existe')
      }

      tipo.nombre = req.body.nombre
      tipo.descripcion = req.body.descripcion
      tipo.fechaActualizacion = new Date()

      tipo = await tipo.save()

      res.send(tipo)
      console.log('Tipo actualizado Correctamente')
    } catch (error) {
      console.log(error)
      res.status(500).send('Ocurrio un error al actualizar el tipo')
    }
  })

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Tipo
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

module.exports = router
