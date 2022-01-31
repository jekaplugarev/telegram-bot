const TelegramApi = require('node-telegram-bot-api')

const token = '5288698944:AAGsI_0t5UjoClkHvNqtS-EDrpIfccMsoso'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const gameOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
    })
}

const againOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Играть еще раз', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    const randomNumber = String(Math.floor(Math.random() * 10))
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, угадай её !', gameOption)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало работы'},
        {command: '/info', description: 'Инфо о пользователе'},
        {command: '/game', description: 'Угадай цифру'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        try {
            if (text === '/start') {
                await bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name} ${msg.from.last_name} !`)
                return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/5a7/cb3/5a7cb3d0-bca6-3459-a3f0-5745d95d54b7/2.webp')
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}!`)
            }
            if (text === '/game') {
                return startGame(chatId)
            }
            return bot.sendMessage(chatId, 'Я тебя не понимаю попробуй еще раз !')
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошла ошибка')
        }
    })

    bot.on('callback_query', async msg => {
        console.log(msg)

        const data = msg.data
        const chatId = msg.message.chat.id
        console.log(chats)
        console.log(chats[chatId])

        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]} !!!`, againOption)
        } else {
            return await bot.sendMessage(chatId, `Не отгадал, пробуй еще раз (бот загадал ${chats[chatId]})`, againOption)
        }
    })
}

start()