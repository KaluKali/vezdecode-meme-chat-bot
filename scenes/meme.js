const Scene = require('node-vk-bot-api/lib/scene');
const Markup = require('node-vk-bot-api/lib/markup');

const meme = (reverse_markup, table_style, resources) => {
    const buttons = [
        {text: 'Выход', color:'negative', action: function (ctx) {
                ctx.reply('Выберите один из вариантов:',null,reverse_markup);
                return ctx.scene.leave();
            }},
    ];

    return new Scene('meme',
        async (ctx) => {
            ctx.scene.next();

            ctx.reply('Давай сюда свои мемы...(макс. 5 штук)', null,
                Markup.keyboard(buttons.map(button=>(Markup.button(button.text, button.color)))).oneTime());
        },
        (ctx) => {
            if (typeof ctx.message.attachments !== 'undefined' && ctx.message.attachments.length) {
                if (!(ctx.message.attachments.length <= 5)) {
                    return ctx.reply('Максимум 5 мемов', null,
                        Markup.keyboard(buttons.map(button=>(Markup.button(button.text, button.color)))).oneTime());
                }
                const memes = ctx.message.attachments;
                ctx.scene.leave();
            }
            else {
                ctx.reply('Выберите один из вариантов:',null,reverse_markup);
                return ctx.scene.leave();
            }
        });
};

module.exports = meme;
