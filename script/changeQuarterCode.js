const MongoClient = require('mongodb').MongoClient
const client = new MongoClient('mongodb://ldarAdmin:123456@localhost:27017/ldar')

async function changeQuarterCode (ctx, next) {
    try {
        await client.connect().catch(err => { 
            console.log('Connected mongodb fail', err)
            return null
        })
        mongoDb = client.db('ldar')
        
        const assignmentCollection = require('../db/assignment')
        const assignOrderCollection = require('../db/assignOrder')
        const detectLedgerCollection = require('../db/detectLedger')

        await detectLedgerCollection.updateMany(
            { quarterCode: '2023-First-Ldar-Quarter' },
            { $set: { quarterCode: '2023-第1季度' } }     
        )

        await detectLedgerCollection.updateMany(
            { quarterCode: '2023-second-Ldar-Quarter' },
            { $set: { quarterCode: '2023-第2季度' } }     
        )

        await detectLedgerCollection.updateMany(
            { quarterCode: '2023-Third-Ldar-Quarter' },
            { $set: { quarterCode: '2023-第3季度' } }     
        )

        await detectLedgerCollection.updateMany(
            { quarterCode: '2023-Fourth-Ldar-Quarter' },
            { $set: { quarterCode: '2023-第4季度' } }     
        )


        console.log('修改季度编码成功')
    } catch (err) {
        console.log('修改季度编码失败:' + err, "error")
    }
}

changeQuarterCode()
