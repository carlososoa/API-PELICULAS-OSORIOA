const mongoose = require('mongoose')

const getConnectionMongo = async () => {
    try {
        const url = 'mongodb+srv://carlososoa:3OecHMNmJO5MAy8I@cluster0.r9jmx3g.mongodb.net/api-peliculas?retryWrites=true&w=majority&appName=Cluster0'
        await mongoose.connect(url)
        console.log('Conexion Exitosa')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getConnectionMongo
}
