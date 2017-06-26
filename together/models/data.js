/**
 * Created by tzzzzz on 17/5/10.
 */
const db = require('../lib/db');
const mongoose = require('mongoose');
const keygen = require('../lib/keygen');
const config = require('../config.json');

const data_schema = new mongoose.Schema({
    id          : {
        type    : Number,
        index   : {
            unique: true
        }
    },
    _id          : {
        type    : Number,
        index   : {
            unique: true
        }
    },
    data:{
        type    : mongoose.Schema.Types.Mixed,
        default : {},
        validate: {
            validator: function (val) {
                return (typeof val == 'object');
            },
            message  : 'data must be a key/value object'
        },
        required: [true, 'data content is required']
    },
    updated_at:Number,
    created_at:Number
});

data_schema.set('toJSON', {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

data_schema.pre('save',async function(next){
    //生成id
    if (!this.id) {
        const id = await keygen.get_id();
        this._id = id;
        this.id = id;
    }

    const cur_time = new Date().getTime();
    this.updated_at = cur_time;
    if (!this.created_at)this.created_at = cur_time;

    next();
});

// 生成一个数据返回一个模型
const data_model = (data_name)=>{
    if (!data_name) throw new Error('data_name必须有值');
    if (typeof data_name !== 'string') throw new Error('data_name必须是字符串');
    db.connections[data_name] = mongoose.createConnection(config.mongo_uri+data_name);
    return db.connections[data_name].model('data',data_schema);
};

module.exports = data_model;