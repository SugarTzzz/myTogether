const {mongo_uri,main_database} = require('../config.json');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connections  = [];
const dbUri = `${mongo_uri}${main_database}`;

connections.main = mongoose.createConnection(dbUri);
mongoose.connection = connections.main;

mongoose.connection.on('connected', function () {
    console.info(`mongodb已连接:${dbUri}`);
}).on('error', function (err) {
    console.info(`mongodb连接错误:${err}`);
}).on('disconnected', function () {
    console.info(`mongodb断开连接`);
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.info(`mongodb连接正常关闭`);
        process.exit(0);
    });
});

module.exports.connections = connections;
module.exports.mongo_uri = mongo_uri;