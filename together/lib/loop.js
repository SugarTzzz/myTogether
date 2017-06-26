/**
 * Created by tzzzzz on 17/5/10.
 */
const node_timer = require('node-schedule');

//默认每10分钟都获取一次
const loop_task = (task,schedule_str='* */10 * * * *')=>{
    node_timer.scheduleJob(schedule_str,task);
};

module.exports = {
    loop_task
};