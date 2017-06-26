/**
 * Created by tzzzzz on 17/5/25.
 */


const util_find = async(req,res,{model,sort_by={created_at:-1}})=>{
    try{
        const {page=1,count=20} = req.body;
        const total_count = await model.count();
        const datas = await model.find({}).sort(sort_by).limit(count).skip((page-1)*count);
        return selfResult(req,res,{
            error_code:0,
            result:datas,
            page:page,
            total_count
        });
    }catch (err){
        return errorResult(req,res,err);
    }
};

module.exports = {
    util_find
};