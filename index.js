const TelegramApi = require('node-telegram-bot-api')
const express = require("express")
const mongoose = require("mongoose")
const https = require('https')
const fs = require('fs')
const corsMiddleware = require("./middleware/cors.middleware")
const appRouter = require("./routers/appRouter")
const {adminOptions, userOptions, carsAddOptions, againOptions} = require('./options')
const axios = require('axios')
const PORT = process.env.PORT || 5001
require('dotenv').config()
const app = express()


app.use(corsMiddleware)
app.use(express.json())
app.use("/app", appRouter)

const sslServer = https.createServer({

    // key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
    // cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
    key: fs.readFileSync('/etc/letsencrypt/live/vag-cars.in.ua/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/vag-cars.in.ua/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/vag-cars.in.ua/chain.pem'),
}, app)

const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true})
let currentUser = '';

const chats = {}
let stepNumber = 0;
let currentStep = '';

const newCarModel = {}
const startGame = async (chatId, currentUser) => {
    await bot.sendMessage(chatId, `Оберіть дію зі списку!`);
    // const randomNumber = Math.floor(Math.random() * 10)
    // chats[chatId] = randomNumber;
    currentUser === "yuriiHiienko" ? await bot.sendMessage(chatId, `Отгадывай ${currentUser}`, adminOptions) : await bot.sendMessage(chatId, `Отгадывай ${currentUser}`, userOptions);
}
const allCarsInSto = [{
    name: 'avensis',
    phone: "2131313"
}, {
    name: 'avensis2',
    phone: "2131313"
}, {
    name: 'avensis3',
    phone: "2131313"
}]

function getClientCar(clientPhone, chatId) {
    return new Promise((resolve, reject) => {
        //here our function should be implemented

    });
}

const start = async () => {

    try {
        await mongoose.connect(`mongodb+srv://yurii:${process.env.DB_PASSWORD}@cluster0.yjfwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
        sslServer.listen(5001, () => console.log(`server started at ${PORT} port`))
        // app.listen(PORT, () => console.log(`server started at ${PORT} port`))
    } catch (e) {
        console.log('Подключение к бд сломалось', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Перезавантажити бота'},
        {command: '/info', description: 'Отримати інформацію'},
        {command: '/menu', description: 'Основне меню'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        currentUser = msg.from.username;
        try {
            if (text === '/start') {
                // await UserModel.create({chatId})

                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
                return bot.sendMessage(chatId, `Вітаємо! Бот для відстежування прогресу по ремонту авто /menu`);
            }
            if (text === '/info') {
                // const user = await UserModel.findOne({chatId})
                console.log(msg)
                return bot.sendMessage(chatId, `Вас звуть  ${msg.from.first_name} ${msg.from.last_name}`);
            }
            if (text === '/menu') {
                return startGame(chatId, currentUser);
            }

            if (currentStep === 'getClientCar') {
                return axios
                    .get(`http://localhost:5001/app/getCar/${msg.text}`)
                    .then(res => {
                        // console.log(`statusCode: ${res.status}`)
                        return bot.sendMessage(chatId, `Власник: ${res.data.clientName}\nНомер телефона: ${res.data.clientPhone}\nРоботи по автомобілю: ${res.data.description}\nАвтомобіль: ${res.data.clientCar}`);
                         // bot.sendMessage(chatId, `Данні по автомобілю знайдено!`);
                    })
                    .catch(error => {
                        return bot.sendMessage(chatId, `На жаль вашого авто не знайдено /menu`);
                    })
            }
            if (currentStep === 'createCar') {
                switch (stepNumber) {
                    case 1:
                        newCarModel.clientName = msg.text;
                        return bot.sendMessage(chatId, `Ім'я Збережено!${msg.text}`, carsAddOptions);
                    case 2:
                        newCarModel.clientPhone = msg.text;
                        return bot.sendMessage(chatId, `Телефон збережено!`, carsAddOptions);
                    case 3:
                        newCarModel.clientCar = msg.text;
                        return bot.sendMessage(chatId, `Автомобіль збережено!`, carsAddOptions);
                    case 4:
                        newCarModel.description = msg.text;
                        console.log(newCarModel);
                        return bot.sendMessage(chatId, `Опис збережено!`, carsAddOptions);

                    default:
                        break
                }
                return bot.sendMessage(chatId, `Done`);
            }
            console.log(msg);
            return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла какая то ошибочка!)');
        }

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId, currentUser)
        }
        // if(data === 'allCarsList')
        if (data === 'name') {
            stepNumber = 1;
            return bot.sendMessage(chatId, `Введіть ім'я клієнта !`);
        }
        if (data === 'clientPhone') {
            stepNumber = 2;
            return bot.sendMessage(chatId, `Введіть номер телефона клієнта!`);
        }
        if (data === 'carName') {
            stepNumber = 3;
            return bot.sendMessage(chatId, `Введіть назву автомобіля клієнта!`);
        }
        if (data === 'carDescription') {
            stepNumber = 4;
            return bot.sendMessage(chatId, `Введіть опис робіт автомобіля!`);
        }
        if (data === 'getClientCar') {
            currentStep = 'getClientCar';
            return bot.sendMessage(chatId, `Введіть номер телефону в форматі 0630000000!`);
        }
        // if (data === 'saveNewCar') {
        //
        //     return bot.sendMessage(chatId, `Введіть назву автомобіля клієнта!`);
        // }
        if (data === 'saveNewCar') {
            if (!newCarModel.clientName || !newCarModel.clientCar || !newCarModel.clientPhone || !newCarModel.description) {
                return bot.sendMessage(chatId, `Ви не внесли всі данні про користувача почніть спочатку!`, carsAddOptions);
            }
            return axios
                .post('http://localhost:5001/app/setCar', {
                    clientName: newCarModel.clientName,
                    clientCar: newCarModel.clientCar,
                    clientPhone: newCarModel.clientPhone,
                    description: newCarModel.description,
                })
                .then(res => {
                    // console.log(`statusCode: ${res.status}`)
                    console.log(res.data)
                    return bot.sendMessage(chatId, `Автомобіль успішно збережено!`);
                })
                .catch(error => {
                    console.error(error)
                })


        }
        if (data === "exit") {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp')
            return bot.sendMessage(chatId, `Вітаємо! Бот для відстежування прогресу по ремонту авто /menu`);
        }
        // const user = await UserModel.findOne({chatId})
        if (data === 'createCar') {
            currentStep = 'createCar'
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, carsAddOptions);


        }
        if (data === 'allCarsList') {
            await bot.sendMessage(chatId, `Список автомобілів нв станції`);
            return axios
                .get('http://localhost:5001/app/getCarItems')
                .then(res => {
                    // console.log(`statusCode: ${res.status}`)
                    console.log(res.data)
                    for (let i = 0; i < res.data.length; i++) {
                        bot.sendMessage(chatId, `${i + 1}.Власник: ${res.data[i].clientName}\nНомер телефона:${res.data[i].clientPhone}\nОпис:${res.data[i].description}\nАвтомобіль:${res.data[i].clientCar}`);
                    }

                })
                .catch(error => {
                    console.error(error)
                })

            // await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            // user.wrong += 1;
            await bot.sendMessage(chatId, `Я вас не розумію /menu`, againOptions);
        }
        // await user.save();
    })
}

start()
