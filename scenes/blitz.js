const Scene = require('node-vk-bot-api/lib/scene');
const Markup = require('node-vk-bot-api/lib/markup');

const blitz = (reverse_markup, table_style, resources) => {
    const buttons = [
        {text: 'Кабачок', color:'primary'},
        {text: 'Баклажан', color:'primary'},
        {text: 'Сахар', color:'primary'},
        {text: 'Соль', color:'positive'},
        {text: 'Перец', color:'positive'},
        {text: 'Лук', color:'positive'},
        {text: 'Чеснок', color:'positive'},
        {text: 'Помидор', color:'positive'},
        {text: 'Выход', color:'negative', action: function (ctx) {
                ctx.reply('Выберите один из вариантов:',null,reverse_markup);
                return ctx.scene.leave();
            }},
    ];

    const costButtons = [
        {text: 'меньше 100 рублей', color:'positive', action: function (ctx) {
                ctx.scene.step = 1;
                return ctx.reply('Хорошая цена 🤤\nСколько стоит...', null,
                    Markup.keyboard(buttons.map(button=>(Markup.button(button.text, button.color))),
                        {columns: 4}
                    ).oneTime()
                );
        }},
        {text: 'больше 100 рублей', color:'primary', action: function (ctx) {
                ctx.scene.step = 1;
                return ctx.reply('Кошелек в порядке 😎\nСколько стоит...', null,
                    Markup.keyboard(buttons.map(button=>(Markup.button(button.text, button.color))),
                        {columns: 4}
                    ).oneTime()
                );
        }},
        {text: 'больше 1000 рублей', color:'negative', action: function (ctx) {
                ctx.scene.step = 1;
                return ctx.reply('Санкционка?? 🥵\nСколько стоит...', null,
                    Markup.keyboard(buttons.map(button=>(Markup.button(button.text, button.color))),
                        {columns: 4}
                    ).oneTime()
                );
            }},
    ];

    return new Scene('blitz',
        async (ctx) => {
            ctx.scene.next();
            // const [user_info] = await resources.db.userInfo(ctx.message.from_id, ['vk_id']);
            //
            // if (!user_info){
            //     ctx.scene.leave();
            //     return ctx.scene.enter('group');
            // }

            ctx.reply('Сколько стоит...', null,
                Markup.keyboard(buttons.map(button=>(Markup.button(button.text, button.color))),
                    {columns: 4}
                ).oneTime()
            );
        },
        (ctx) => {
            if (typeof ctx.message.payload !== 'undefined') {
                const buttons_opt = JSON.parse(ctx.message.payload)
                const btn = buttons.find(b => b.text === buttons_opt.button);
                if (btn && btn.action) { btn.action(ctx); }
                ctx.reply('?', null,
                    Markup.keyboard(costButtons.map(button=>(Markup.button(button.text, button.color)))
                    ).inline()
                );
                ctx.scene.next();
            }
            else {
                ctx.reply('Выберите один из вариантов:',null,reverse_markup);
                return ctx.scene.leave();
            }
        },
        (ctx) => {
            if (typeof ctx.message.payload !== 'undefined') {
                const buttons_opt = JSON.parse(ctx.message.payload)
                const btn = costButtons.find(b => b.text === buttons_opt.button);
                if (btn && btn.action) { btn.action(ctx); }
            }
            else {
                ctx.reply('Выберите один из вариантов:',null,reverse_markup);
                return ctx.scene.leave();
            }
        });
};

module.exports = blitz;
