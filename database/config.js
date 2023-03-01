const mongoose = require('mongoose')

const dbConnection = async() => {
    mongoose.set('strictQuery', true)
    try {
        await mongoose.connect( process.env.MONGODB_CNN, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('Base de datos online')
    } catch (error) {
        console.log(error)
        throw new Error('Error a la hora de iniciar la base de datos')

    }
}



module.exports = {
    dbConnection
}