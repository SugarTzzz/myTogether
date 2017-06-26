/**
 * Created by tzzzzz on 17/5/25.
 */

const data_model = require('../models/data');
const array_util = require('../lib/array_util');
const data_util = require('./data_util');

const API500px = require('500px');
const api500px = new API500px('cv1N7Cm0DpX2HLtdlVxSXZ3uS8OjTglMXflgAbD3');

const get_photos = async()=>{
    return new Promise((s,f)=>{
        api500px.photos.getEditorsChoice({'sort': 'created_at', 'rpp': '20','image_size[]':'14'},(error,results)=> {
            if (error) {
                f(error);
            }else {
                s(results);
            }
        })
    });
};

const get_news = async()=>{
    try{
        const {photos:new_datas} = await get_photos();

        const px_model = data_model('px');
        const old_datas = await px_model.find({});
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
        const datas = save_datas.map(({id,description,image_url,created_at})=>{
            if (Array.isArray(image_url)){
                image_url = image_url.pop();
            }
            const data = {
                id,
                title:description || 'Nothing',
                image_url,
                make_time:created_at
            };
            return {data};
        });

        await px_model.create(datas);
        console.log(`${new Date()}500px数据已更新`);
    }catch (err){
        console.log(`${new Date()}500px数据更新失败`);
        console.log(err);
    }
};

const find = async(req,res)=>{
    try{
        await data_util.util_find(req,res,{
            model:data_model('px'),
            sort_by:{'data.make_time':-1}
        });
    }catch (err){
        console.log(err);
    }
};


module.exports = {
    get_news,
    find
};

