const MongoClient = require('mongodb').MongoClient
global.mongoDb = null

async function connectDb() {
    if (mongoDb) return
    const client = new MongoClient(config.mongodbUrl)
    
    const res = await client.connect().catch(err => { 
        logger.log('Connected mongodb fail', err)
        return null
    })
    if (!res) return null

    logger.log('Connected successfully to mongodb')
    mongoDb = client.db('ldar')
  
    return 'ok'
}

module.exports = {
    connectDb
}
