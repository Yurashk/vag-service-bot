const CarsInfo = require("../models/CarsInfo")

class carsController {
    async createCarItems(req, res) {
        try {
            // const errors = validationResult(req)
            // if (!errors.isEmpty()) {
            //     return res.status(400).json({message: "ошибка при создании товара", errors})
            // }
            console.log(req.body)
            const {clientName, description, clientPhone, clientCar} = req.body; // get params from request
            // const item = await CarsInfo.findOne({name})
            // if (item) { // check if candidate already exist
            //     return res.status(400).json({message: "Товар с таким именем уже существует"})
            // }
            const car = new CarsInfo({clientName, description, clientPhone, clientCar}); // create user
            await car.save() // save user
            return res.json({message: "пользователь успешно зарегестрирован "})
        } catch (e) {
            console.log(e);
            res.status(400).json(e)

        }
    }

    async getOneUserCar(req, res) {
        try {
            const clientPhone = req.params.clientPhone;
            if (!clientPhone) return
            const car = await CarsInfo.findOne({clientPhone})
            res.json({
                clientName: car.clientName,
                clientPhone: car.clientPhone,
                clientCar: car.clientCar,
                description: car.description,
            })
        } catch (e) {
            console.log(e)
        }
    }

    async getCarItems(req, res) {
        try {
            const cars = await CarsInfo.find()
            res.json(cars)
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new carsController()
