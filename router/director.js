const { Router } = require('express')
const Director = require('../models/Director.js')
const { validationResult, check } = require('express-validator')

const router = Router()

router.post('/', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])
]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      const existeDirector = await Director.findOne({ nombre: req.body.nombre })
      if (existeDirector) {
        return res.status(400).send('Este director ya existe')
      }

      let director = new Director()
      director.nombre = req.body.nombre
      director.estado = req.body.estado
      director.fechaCreacion = new Date()
      director.fechaActualizacion = new Date()

      director = await director.save()

      res.send(director)
      console.log('Director guardado')
    } catch (error) {
      console.log(error)
    }
  })

router.get('/', (req, res) => {
  Director
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

router.put('/:id', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo'])]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      let director = await Director.findById(req.params.id)
      if (!director) {
        return res.status(400).send('Director no existe')
      }

      const existeDirector = await Director.findOne({ nombre: req.body.nombre, _id: { $ne: director._id } })
      if (existeDirector) {
        return res.status(400).send('Este genero ya existe')
      }

      director.nombre = req.body.nombre
      director.estado = req.body.estado
      director.fechaActualizacion = new Date()

      director = await director.save()

      res.send(director)
      console.log('Director actualizado exitosamente')
    } catch (error) {
      console.log(error)
      res.status(500).send('Ocurrio un error al actualizar el director')
    }
  })

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Director
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

module.exports = router
