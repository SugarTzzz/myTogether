/**
 * Created by xiaos on 17/5/10.
 */
//差集 去掉b中出现的a的元素
const sub = (a,b) =>{
    const set = new Set(a);
    return b.filter(v=>{
        return !set.has(v)
    });
};

module.exports = {
    sub
};