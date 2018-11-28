const Config = require('./config'),
    Mongodb = require('mongodb'),
    MongoClient = Mongodb.MongoClient;

class Db {
    constructor() {
        this.db = ''
    }

    // // 存放实例化的Db
    // static instance

    // 静态方法，获取Db实例
    static getInstance() {
        if (Db.instance) Db.instance
        Db.instance = new Db()
        Db.instance.connect()
        return Db.instance
    }

    // 连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            // 判断是否已经连接上了数据库
            if (this.db) resolve(this.db)
            // 未连接数据库，连接数据库
            // 创建一个新的MongoClient
            const client = new MongoClient(Config.baseUrl)
            // 使用connect方法连接服务器
            client.connect(err => {
                if (err) reject(err)
                this.db = client.db(Config.dbName)
                resolve(this.db)
            })
        })
    }

    // 关闭数据库连接
    close() {
        this.db.close()
    }

    // 插入一条数据
    /*
    * collectionName 表的名称
    * insertData 插入数据  Object/Array
    * */
    insert(collectionName, insertData) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName)
                if (insertData instanceof Array) { // 判断插入的数据是不是数组,代表多数据插入
                    collection.insertMany(insertData, (err, result) => {
                        if (err) reject(err)
                        resolve(result)
                    })
                } else if (insertData instanceof Object) { // 判断插入数据是不是json，代表插入一条数据
                    collection.insertOne(insertData, (err, result) => {
                        if (err) reject(err)
                        resolve(result)
                    })
                } else {
                    reject('插入数据只能是json或者是array')
                }
            }, err => {
                reject(err)
            })
        })
    }

    // 查询数据
    /*
    * collectionName 表的名称
    * findConditions 查询条件
    * */
    find(collectionName, findConditions) {
        // 判断有木有查询条件，有的话按照查询条件执行，否则查询全部
        findConditions = findConditions ? findConditions : {}
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                const collection = db.collection(collectionName)
                const res = collection.find(findConditions)
                res.toArray((err, docs) => {
                    if (err) reject(err)
                    resolve(docs)
                })
            }, err => {
                reject(err)
            })
        })
    }
}

module.exports = Db.getInstance()