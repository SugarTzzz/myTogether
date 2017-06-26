/**
 * Created by tzzzzz on 17/5/25.
 */
const request = require('request-promise');
const {JSDOM} = require('jsdom');
const url = require('url');
const data_model = require('../models/data');
const array_util = require('../lib/array_util');
const data_util = require('./data_util');

const get_news = async()=>{
    try{
        const pingwest_model = data_model('pingwest');
        const html = await request.get('http://www.pingwest.com/');
        const dom = new JSDOM(html);
        const {document} = dom.window;

        const new_items = document.querySelectorAll('.news-item');
        const new_datas = Array.from(new_items).map(data=>{
            const title_dom = data.querySelector('.title a');
            const title = title_dom.innerHTML;
            const id = url.parse(title_dom.href).pathname;
            const bg_image_url = data.querySelector('.news-thumb').style.backgroundImage;
            let image_url = bg_image_url.replace(/url/,'').split('');
            image_url.shift();
            image_url.pop();
            image_url = image_url.join('');
            return {
                title,
                id,
                image_url
            };
        });

        //取所有旧记录
        const old_datas = await pingwest_model.find({});
        const old_ids = old_datas.map(data=>{
            return data.data.id;
        });
        const new_ids = new_datas.map(data=>{
            return data.id;
        });
        const sub_ids = array_util.sub(old_ids,new_ids);
        const save_datas = new_datas.filter(data=>{
            return sub_ids.indexOf(data.id) !== -1;
        });

        //标准格式入库
        const datas = save_datas.map(({id,title,image_url})=>{
            const data = {
                id,
                title,
                image_url
            };
            return {data};
        });

        await pingwest_model.create(datas);
        console.log(`${new Date()}pingwest数据已更新`);
    }catch (err){
        console.log(err);
        console.log(`${new Date()}pingwest数据更新失败`);
    }
};

const find = async(req,res)=>{
    try{
        const pingwest_model = data_model('pingwest');
        await data_util.util_find(req,res,{
            model:pingwest_model
        });
    }catch (err){
        console.log(err);
    }
};


module.exports = {
    get_news,
    find
};



