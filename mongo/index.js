const express = require('express');
const app = express();
const path = require('path');
const mongo = require('./models/db');

app.get('/', (req, res) => {
    res.sendFile(path.resolve('./index.html'));
});

app.get('/api/list', async (req, res) => {
    //分页查询
    const {page, category, keyword} = req.query; //从query中解构出请求的页面

    //构造条件
    const condition = {};
    if (category) {
        condition.category=category;
    }

    if(keyword) {
        condition.name={$regex:new RegExp(keyword)}
    }

    console.log(condition);
    try {
        const col = mongo.col('fruits');
        const total = await col.find(condition).count();
        const fruits = await col
            .find(condition)
            .skip((page - 1) * 5)//表示一页展示5个
            .limit(5)
            .toArray();
        res.json({code: 1, data: {fruits, pagination: {total, page}}})

    } catch (err) {
        throw err;
    }
});

app.get('/api/category', async (req, res) => {
    const col = mongo.col('fruits');
    const data = await col.distinct('category');
    res.json({code: 1, data});
});

app.listen(3000);