/**
 * Created by tzzzzz on 17/5/25.
 */
const request = require('request-promise');
const {JSDOM} = require('jsdom');
const url = require('url');
const data_model = require('../models/data');
const array_util = require('../lib/array_util');
const data_util = require('./data_util');

const get_news = async(req,res)=>{
    try{
        const geo_model = data_model('geo');

        const html = await request.get('http://www.nationalgeographic.com.cn/photography/galleries/');
        const dom = new JSDOM(html);
        const {document} = dom.window;

        const new_items = document.querySelectorAll('.show-list-dl');
        const new_datas = Array.from(new_items).map(data=>{
            const {src:image_url,alt:title} = data.querySelector('img');
            const {innerHTML:content,href} = data.querySelector('dd a');
            const id = url.parse(href).pathname;
            const make_time = data.querySelector('.time-dd li').innerHTML;

            return {
                id,
                title,
                image_url,
                content,
                make_time
            }
        });

        const old_datas = await geo_model.find();
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

        //标准化
        const datas = save_datas.map(({id,title,image_url,content,make_time})=>{
            const data = {
                id,
                title,
                image_url,
                content,make_time
            };
            return {data};
        });
        await geo_model.create(datas);
        console.log(`${new Date()} 国家地理数据已更新`);
    }catch (err){
        console.log(err);
    }
};

const find = async(req,res)=>{
    try{
        await data_util.util_find(req,res,{
            model:data_model('geo')
        });
    }catch (err){
        console.log(err);
    }
};

module.exports = {
    get_news,
    find
};