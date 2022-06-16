module.exports = {
    adminOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Внести  автомобіль', callback_data: 'createCar'}],
                [{text: 'Статус по автомобілю', callback_data: 'getClientCar'}],
                [{text: 'Список всіх автомобілів', callback_data: 'allCarsList'}],
                [{text: 'Всі автомобілі', callback_data: 'allCars'}],
                [{text: 'Вихід', callback_data: 'exit'}],
            ]
        })
    }, userOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Статус по автомобілю', callback_data: 'getClientCar'}],
                [{text: 'На головну', callback_data: 'exit'}],
            ]
        })
    },

    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Редагувати назви авто', callback_data: '/again'}],
                [{text: 'Редагувати опис', callback_data: '/again'}],
            ]
        })
    },carsAddOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'Внести імʼя клієнта', callback_data: 'name'}],
                [{text: 'Внести телефон клієнта', callback_data: 'clientPhone'}],
                [{text: 'Внести авто клієнта', callback_data: 'carName'}],
                [{text: 'Внести опис робіт', callback_data: 'carDescription'}],
                [{text: 'Зберегти', callback_data: 'saveNewCar'}],
                [{text: 'На головну', callback_data: 'exit'}],
            ]
        })
    },exitOption: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: 'На головну', callback_data: 'exit'}],
            ]
        })
    }
}
