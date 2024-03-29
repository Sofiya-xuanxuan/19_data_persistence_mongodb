//mongoose.js
const mongoose = require('mongoose');

//1.连接
mongoose.connect('mongodb://localhost:27017/test', {userNewUrlParser: true});

const conn = mongoose.connection;
conn.on('error', () => console.log('连接数据库失败'));

conn.once('open', async () => {
    //2.定义一个Schema-Table
    const Schema = mongoose.Schema({
        category: String,
        name: String
    });

    //3.编译一个Model，它对应数据库中复数、小写的Collection
    const Model = mongoose.model('fruit', Schema);
    try {
        //4.创建create返回Promise
        let r = await Model.create({
            category: '温带水果',
            name: '苹果',
            price: 5
        });

        console.log('插入数据：', r);

        //5.查询：find返回Query，它实现了then和catch，可以当Promise使用，如果需要返回Promise，调用其exec()
        r = await Model.find({name: '苹果'});
        console.log('查询结果：', r);

        //6.更新updateOne返回Query
        r = await Model.updateOne({name: '苹果'}, {$set: {name: '啊蒙古'}});
        console.log('更新结果：', r);

        //7.删除deleteOne返回Query
        r = await Model.deleteOne({name: '苹果'});
        console.log('删除结果：', r);

        //Schema模型
        const blogSchame=mongoose.Schema({
            title:{type:String,required:[true,'标题为必填项']},//定义校验规则
            author:String,
            body:String,
            comments:[{body:String,date:Date}],//定义对象数组
            date:{type:Date,default:Date.now},//指定默认值
            hidden:Boolean,
            meta:{
                //定义对象
                votes:Number,
                favs:Number
            }
        });
        //实例方法
        blogSchame.methods.findByAuthor=function(author) {
          return this.model('blog').find({author}).exec();
        };
        //静态方法
        blogSchame.statics.findByAuthor=function(author) {
            return this.model('blog')
                .find({author})
                .exec();
        };
        //虚拟属性
        blogSchame.virtual('commentsCount').get(function(){
            return this.comments.length;
        });

        //获取模型实例
        const BlogModel=mongoose.model('blog',blogSchame);
        const blog=new BlogModel({
            title:'nodejs持久化',
            author:'sofiya',
            body:'...'
        });
        r=await blog.save();
        console.log('新增blog：', r);

        //调用实例方法
        r=await blog.findByAuthor('sofiya');
        console.log('实例方法findByAuthor：', r);

        //调用静态方法
        r=await BlogModel.findByAuthor('sofiya');
        console.log('静态方法findByAuthor：', r);

        //调用虚拟属性
        r=await BlogModel.findOne({author:'sofiya'});
        console.log('blog留言数：', r.commentsCount);

    } catch (err) {
        console.log(err);
    }
});


