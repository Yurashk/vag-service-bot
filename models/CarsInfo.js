const {Schema, model} = require("mongoose")

const CarsInfo = new Schema({
    description: {type: String,unique: false, required: true},
    clientName: {type: String,unique: false},
    clientPhone: {type: String,unique: false},
    clientCar: {type: String,unique: false},
})

module.exports = model("CarsInfo", CarsInfo)
