const { Router } = require('express')
const Productora = require('../models/Productora.js')
const { validationResult, check } = require('express-validator')

const router = Router()

router.post('/', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
  check('descripcion', 'invalid.descripcion').not().isEmpty(),
  check('slogan', 'invalid.descripcion').not().isEmpty()]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      const existeProductora = await Productora.findOne({ nombre: req.body.nombre })
      if (existeProductora) {
        return res.status(400).send('Esta productora ya existe')
      }

      let productora = new Productora()
      productora.nombre = req.body.nombre
      productora.estado = req.body.estado
      productora.descripcion = req.body.descripcion
      productora.slogan = req.body.slogan
      productora.fechaCreacion = new Date()
      productora.fechaActualizacion = new Date()

      productora = await productora.save()

      res.send(productora)
      console.log('Se ha creado exitosamente la productora')
    } catch (error) {
      console.log(error)
    }
  })

router.get('/', (req, res) => {
  Productora
    .find()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

router.put('/:id', [
  check('nombre', 'invalid.nombre').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
  check('descripcion', 'invalid.descripcion').not().isEmpty(),
  check('slogan', 'invalid.slogan').not().isEmpty()]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      let productora = await Productora.findById(req.params.id)
      if (!productora) {
        return res.status(400).send('Productora no existe')
      }

      const existeProductora = await Productora.findOne({ nombre: req.body.nombre, _id: { $ne: productora._id } })
      if (existeProductora) {
        return res.status(400).send('Este genero ya existe')
      }

      productora.nombre = req.body.nombre
      productora.estado = req.body.estado
      productora.descripcion = req.body.descripcion
      productora.slogan = req.body.slogan
      productora.fechaActualizacion = new Date()

      productora = await productora.save()

      res.send(productora)
      console.log('Productora actualizada correctamente')
    } catch (error) {
      console.log(error)
      res.status(500).send('Ocurrio un error al actualizar el genero')
    }
  })

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Productora
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

module.exports = router
