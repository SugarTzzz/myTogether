/**
 * Created by tzzzzz on 17/5/24.
 */
const request = require('request-promise');
const data_model = require('../models/data');
const array_util = require('../lib/array_util');
const moment = require('moment');
const data_util = require('./data_util');

const get_news = async()=>{
    try{
        const date = moment().format('YYYY-M');
        const one_datas = await request.get(`http://v3.wufazhuce.com:8000/api/hp/bymonth/${date}`);
        const {data:new_datas} = JSON.parse(one_datas);

        // 返回到是模型 就不用引用 zhihuModel 了
        const one_model = data_model('one');

        //查当月的库
        const old_datas = await one_model.find({'data.date':date});
        // 旧数据
        const old_ids = old_datas.map(data=>{
            return data.data.id;
        });
        // 新数据
        const new_ids = new_datas.map(data=>{
            return data.hpcontent_id;
        });
        // 过滤新数据中 旧的数据 id
        const sub_ids = array_util.sub(old_ids,new_ids);
        // 过滤数据库data
        const save_datas = new_datas.filter(data=>{

            return sub_ids.indexOf(data.hpcontent_id) !== -1;

        });

        //标准格式入库
        const datas = save_datas.map(({hpcontent_id,hp_img_url,hp_content,hp_makettime})=>{
            const data = {
                date,
                id:hpcontent_id,
                title:hp_content,
                image_url:hp_img_url,
                make_time:hp_makettime
            };
            return {data};
        });
        // 加入数据库
        await one_model.create(datas);
        console.log(`${new Date()}ONE数据已更新`);
    }catch (err){
        console.log(`${new Date()}获取ONE数据失败`);
        console.log(err);
    }
};

const find = async(req,res)=>{
    try{
        const one_model = data_model('one');
        await data_util.util_find(req,res,{
            model:one_model,
            sort_by:{'data.id':-1}
        });
    }catch (err){
        console.log(err);
    }
};

module.exports = {
    get_news,
    find
};

