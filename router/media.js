const { Router } = require('express')
const Media = require('../models/Media.js')
const Director = require('../models/Director.js')
const Productora = require('../models/Productora.js')
const Genero = require('../models/Genero.js')
const Tipo = require('../models/Tipo.js')
const { validationResult, check } = require('express-validator')

const router = Router()

async function consulta(media) {
  const resutlado = await Media.aggregate([
    {
      $match: { _id: media._id }
    },
    {
      $lookup:
      {
        from: 'generos',
        localField: 'genero',
        foreignField: '_id',
        as: 'generoInfo'

      }

    },
    {
      $unwind: '$generoInfo'
    },
    {
      $lookup:
      {
        from: 'directores',
        localField: 'director',
        foreignField: '_id',
        as: 'directorInfo'

      }

    },
    {
      $unwind: '$directorInfo'
    },
    {
      $lookup:
      {
        from: 'productoras',
        localField: 'productora',
        foreignField: '_id',
        as: 'productoraInfo'

      }

    },
    {
      $unwind: '$productoraInfo'
    },
    {
      $lookup:
      {
        from: 'tipos',
        localField: 'tipo',
        foreignField: '_id',
        as: 'tipoInfo'

      }

    },
    {
      $unwind: '$tipoInfo'
    }

  ])

  return resutlado
}

router.post('/', [
  check('serial', 'invalid.serial').not().isEmpty(),
  check('titulo', 'invalid.titulo').not().isEmpty(),
  check('sinopsis', 'invalid.sinopsis').not().isEmpty(),
  check('url', 'invalid.url').not().isEmpty(),
  check('imgPortada', 'invalid.imgPortada').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
  check('anioEstreno').notEmpty().withMessage('El campo año no puede estar vacio')
    .isInt({ min: 1890, max: 2024 }).withMessage('El año debe estar entre 1890 y 2024'),
  check('genero', 'invalid.genero').not().isEmpty(),
  check('director', 'invalid.director').not().isEmpty(),
  check('productora', 'invalid.productora').not().isEmpty(),
  check('tipo', 'invalid.tipo').not().isEmpty()
]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      const existeUrl = await Media.findOne({ url: req.body.url })
      if (existeUrl) {
        return res.status(400).send('La URL usada ya se encuentra registrada')
      }
      const existeSerial = await Media.findOne({ serial: req.body.serial })
      if (existeSerial) {
        return res.status(400).send('El serial usado ya se encuentra registrado')
      }

      let media = new Media()
      media.serial = req.body.serial
      media.titulo = req.body.titulo
      media.sinopsis = req.body.sinopsis
      media.url = req.body.url
      media.imgPortada = req.body.imgPortada
      media.estado = req.body.estado
      media.fechaCreacion = new Date()
      media.fechaActualizacion = new Date()
      media.anioEstreno = req.body.anioEstreno
      media.genero = req.body.genero
      media.director = req.body.director
      media.productora = req.body.productora
      media.tipo = req.body.tipo

      media = await media.save()

      const resultado = await consulta(media)

      res.send(resultado)

      console.log('Medio creado satisfactoriamente')
    } catch (error) {
      console.log(error)
    }
  })

router.get('/', async function (req, res) {
  const media = await Media.find()
    .populate(['genero', 'director', 'productora', 'tipo'])

  res.send(media)
})

router.put('/:id', [
  check('serial', 'invalid.serial').not().isEmpty(),
  check('titulo', 'invalid.titulo').not().isEmpty(),
  check('sinopsis', 'invalid.sinopsis').not().isEmpty(),
  check('url', 'invalid.url').not().isEmpty(),
  check('imgPortada', 'invalid.imgPortada').not().isEmpty(),
  check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
  check('anioEstreno').notEmpty().withMessage('El campo año no puede estar vacio')
    .isInt({ min: 1890, max: 2024 }).withMessage('El año debe estar entre 1890 y 2024'),
  check('genero', 'invalid.genero').not().isEmpty(),
  check('director', 'invalid.director').not().isEmpty(),
  check('productora', 'invalid.productora').not().isEmpty(),
  check('tipo', 'invalid.tipo').not().isEmpty()]
  , async function (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ mensaje: errors.array() })
      }

      let media = await Media.findById(req.params.id)
      if (!media) {
        return res.status(400).send('Media no existe')
      }

      const existeUrl = await Media.findOne({ url: req.body.url, _id: { $ne: media._id } })
      if (existeUrl) {
        return res.status(400).send('La URL usada ya se encuentra registrada')
      }
      const existeSerial = await Media.findOne({ serial: req.body.serial, _id: { $ne: media._id } })
      if (existeSerial) {
        return res.status(400).send('El serial usado ya se encuentra registrado')
      }

      media.serial = req.body.serial
      media.titulo = req.body.titulo
      media.sinopsis = req.body.sinopsis
      media.url = req.body.url
      media.imgPortada = req.body.imgPortada
      media.estado = req.body.estado
      media.fechaActualizacion = new Date()
      media.anioEstreno = req.body.anioEstreno
      media.genero = req.body.genero
      media.director = req.body.director
      media.productora = req.body.productora
      media.tipo = req.body.tipo

      media = await media.save()

      res.send(media)
      console.log('Media actualizada exitosamente')
    } catch (error) {
      console.log(error)
      res.status(500).send('Ocurrio un error al actualizar la Media')
    }
  })

router.delete('/:id', (req, res) => {
  const { id } = req.params
  Media
    .deleteOne({ _id: id })
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }))
})

module.exports = router
