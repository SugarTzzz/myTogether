/**
 * Created by tzzzzz on 17/5/10.
 */
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const output = require('./lib/output');
const config = require('./config.json');

const task = require('./task/task');
const db = require('./lib/db');
const zhihu = require('./data/zhihu');
const one = require('./data/one');
const pingwest = require('./data/pingwest');
const px = require('./data/px500');
const geo = require('./data/geo');


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(fileUpload());

const router = express.Router();


router.route('/zhihu.json').post(zhihu.find);
router.route('/one.json').post(one.find);
router.route('/pingwest.json').post(pingwest.find);
router.route('/500px.json').post(px.find);
router.route('/geo.json').post(geo.find);

app.use('/',router);

app.listen(config.server_port,()=>{
    console.log(`服务已启动，端口:${config.server_port}`);
});

//爬取数据任务
task.start();