const loop = require('../lib/loop');
const zhihu = require('../data/zhihu');
const one = require('../data/one');
const pingwest = require('../data/pingwest');
const px = require('../data/px500');
const geo = require('../data/geo');

const zhihu_task = async()=>{
    await zhihu.get_news();
};

const one_task = async()=>{
    await one.get_news();
};

const ping_task = async()=>{
    await pingwest.get_news();
};

const px_task = async()=>{
    await px.get_news();
};

const geo_task = async()=>{
    await geo.get_news();
};


const start = ()=>{
    //知乎日报任务 30min
    loop.loop_task(zhihu_task,'0 */30 * * * *');
    //ONE任务 每天早上6点10分
    loop.loop_task(one_task,'0 10 6 * * *');
    //品玩任务 30min
    loop.loop_task(ping_task,'0 */30 * * * *');
    //500px任务 5个小时
    loop.loop_task(px_task,'0 0 */5 * * *');
    //国家地理 5个小时
    loop.loop_task(geo_task,'0 0 */5 * * *');
};

module.exports = {
    start
};

