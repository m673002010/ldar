const MongoClient = require('mongodb').MongoClient
const client = new MongoClient('')

async function fixRetestLedger (ctx, next) {
    try {
        await client.connect().catch(err => { 
            console.log('Connected mongodb fail', err)
            return null
        })
        mongoDb = client.db('ldar')
        
        const detectLedgerCollection = mongoDb.collection('detectLedger')
        await detectLedgerCollection.updateMany(
            { repairEndDate: { $exists: true }, planRepairDate: { $exists: true } }, // 这个查询选择包含undefinedField属性的文档
            { $unset: { repairEndDate: "", planRepairDate: "" } }     // 使用$unset操作符删除undefinedField属性
        )

        console.log('修复复测信息成功')
    } catch (err) {
        console.log('修复复测信息失败:' + err, "error")
    }
}

fixRetestLedger()
