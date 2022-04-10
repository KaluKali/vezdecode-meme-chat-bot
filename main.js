require('dotenv').config();
process.title = 'vezdecode-meme-bot';

const VkBot = require('node-vk-bot-api');
const bot = new VkBot(process.env.VK_API_KEY);

const Session = require('node-vk-bot-api/lib/session');
const Stage = require('node-vk-bot-api/lib/stage');
const Markup = require('node-vk-bot-api/lib/markup');
const schedule = require('node-schedule');

const SqlDb = require('./tools/sql_data');
const levenshtein = require('./tools/message_tools/levenshtein');
// Создает подключение к базе
const sqlDB = new SqlDb();
// resource
const reverse_menu = Markup.keyboard([
    Markup.button('Привет', 'positive'),
    Markup.button('Опрос', 'primary'),
    Markup.button('Мем', 'primary'),
    Markup.button('Загрузить мем', 'primary'),
    Markup.button('Статистика', 'primary'),
], { columns:2 }).oneTime();
const ctx_scenes = require('./scenes/index');
const ctx_methods = require('./methods/index');
const leven_list = ['привет','опрос'];
// jobs
// prod 0 0 */6 ? * *
// Every hour 0 0 * ? * *
// Every second * * * ? * *
// restart
schedule.scheduleJob('0 0 */12 ? * *', ()=>{
    bot.stop();
    console.log('Timeout to restart bot is set.');
    setTimeout(()=>{
        bot.start();
        bot.startPolling((err) => {
            if (!err) {
                console.log('Bot restarted.')
            } else {
                console.error(err)
            }
        });
    }, 30000);
});
// scenes
bot.use(new Session().middleware());
bot.use(new Stage(...ctx_scenes(reverse_menu, null, { data: {}, db: sqlDB })).middleware());

// serialization messages
bot.use((ctx, next)=>{
    ctx.message.payload = ctx.message.payload ? JSON.parse(ctx.message.payload) : [];
    // console.log(ctx.message)
    if (!ctx.message.text || ctx.message.from_id === -178574529) return next();
    const message = ctx.message.text.split(' ');

    for (let i of leven_list){
        if (levenshtein(i, message[0]) <= 2){
            message.shift();
            message.unshift(i);
            ctx.message.text = message.join(' ');
            return next();
        }
    }
    next();
});
bot.command('привет', (ctx)=>ctx.reply('Привет вездекодерам!', null, reverse_menu));
bot.command('опрос', (ctx) => {
    ctx.scene.enter('blitz');
});
bot.command('мем', (ctx) => {
    ctx.scene.enter('blitz')
});
bot.command('загрузить мем', (ctx) => {
    ctx.scene.enter('meme')
});
// bot.command('неделя', (ctx)=>{
//     ctx.scene.enter('week');
// });
// bot.command('найди', async (ctx)=>{
//     let msg = await Message.parseFind(ctx.message.text, {data: tritData});
//     await ctx_methods(reverse_menu, null, { data: tritData }).find_pairs(ctx,msg);
// });
// bot.command('кабинет', async (ctx)=>{
//     let msg = await Message.parseCabinet(ctx.message.text, {data: tritData});
//     await ctx_methods(reverse_menu, null, { data: tritData }).find_cabinet(ctx,msg);
// });
// bot.command('расписание', async (ctx)=>{
//     let msg = await Message.parsePairsDay(ctx.message.text, {data: tritData});
//     await ctx_methods(reverse_menu, null, { data: tritData, db: sqlDB }).pairs_day(ctx,msg);
// });
// bot.command('таблица', async (ctx)=>{
//     await ctx_methods(reverse_menu, null, {data: tritData, db: sqlDB}).pairs_table(ctx);
// });
bot.command('2412', async (ctx)=>{
    if (ctx.message.peer_id === 461450586){
        ctx.reply('Лучшая конфа!', null, reverse_menu);
    }
});

bot.on((ctx) => {
    if (ctx.message.peer_id < 2000000000){
        // step=0 в ctx.scene.enter фиксит определенный баг, не помню какой...
        ctx.scene.enter('unknown_command',0)
    }
});

bot.startPolling((err) => {
    if (!err) console.log('Bot started')
    else console.trace(err);
});
