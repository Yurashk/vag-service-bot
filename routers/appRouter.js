const Router = require("express")
const appRouter = new Router()
// const coffeeController = require("../controllers/coffeeController")
const carsController = require("../controllers/carsController")
// const {check} = require("express-validator")

// appRouter.get("/users/:id", authMiddleware, userController.getOneUser)
// appRouter.patch("/users/add-bonuses", authMiddleware, userController.addUserBonuses)
// appRouter.patch("/users/spend-bonuses", authMiddleware, userController.removeUserBonuses)
// appRouter.get("/coffee", authMiddleware, coffeeController.getCoffeeItems)
appRouter.get("/getCarItems",  carsController.getCarItems)
appRouter.get("/getCar/:clientPhone",  carsController.getOneUserCar)
appRouter.post("/setCar",  carsController.createCarItems)


module.exports = appRouter
