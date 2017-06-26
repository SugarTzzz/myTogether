/**
 * Created by tzzzzz on 17/5/10.
 */
const request = require('request-promise');
const data_model = require('../models/data');
const array_util = require('../lib/array_util');
const moment = require('moment');
const data_util = require('./data_util');

//获取知乎最新的数据
const get_news = async()=>{
    try{

        const result = await request.get('http://news-at.zhihu.com/api/4/news/latest');
        const {date,stories} = JSON.parse(result);
        // 生成一个zhihu数据库
        const zhihu_model = data_model('zhihu');

        //先查询出当天的stories和爬取的stories做差集
        const old_stories = await zhihu_model.find({'data.date':date});

        //求出未存的最新数据
        const old_ids = old_stories.map(data=>{return data.data.id;});
        const new_ids = stories.map(data=>{return data.id});
        const sub_ids = array_util.sub(old_ids,new_ids);
        const save_datas = stories.filter(data=>{
            return sub_ids.indexOf(data.id) !== -1;
        });

        const datas = save_datas.map(({id,images,title})=>{
            const data = {
                date,
                id,
                title,
                image_url:images[0]
            };
            return {data};
        });
        await zhihu_model.create(datas);
        console.log(`${new Date()} 知乎数据已更新`);
    }catch (err){
        console.log(`${new Date()} 知乎数据更新失败`);
        console.log(err);
    }
};

//查询知乎列表数据
const find = async(req,res)=>{
    try{
        console.log('开始查询知乎数据');
        // 生成一个 数据库. 返回一个模型
        const zhihu_model = data_model('zhihu');
        await data_util.util_find(req,res,{
            model:zhihu_model,
        });
        console.log('结束查询知乎数据');
    }catch (err){
        console.log(err);
    }
};

module.exports = {
    get_news,
    find
};


