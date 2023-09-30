const MongoClient = require('mongodb').MongoClient
const client = new MongoClient('mongodb://ldarAdmin:123456@localhost:27017/ldar')

async function fixDetectLedger (ctx, next) {
    try {
        await client.connect().catch(err => { 
            console.log('Connected mongodb fail', err)
            return null
        })
        mongoDb = client.db('ldar')
        
        const detectLedgerCollection = mongoDb.collection('detectLedger')
        const componentCollection = mongoDb.collection('component')
        const lodash = require('lodash')

        const detectData = await detectLedgerCollection.find({ companyNum: 'PTNM' }).toArray()
        const labelExpandArr = lodash.map(detectData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum: 'PTNM', labelExpand: { $in: labelExpandArr } }).toArray()

        await detectLedgerCollection.updateMany(
            { undefined: { $exists: true } }, // 这个查询选择包含undefinedField属性的文档
            { $unset: { undefined: "" } }     // 使用$unset操作符删除undefinedField属性
        )

        for (const item of detectData) {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            if (component) {
                await detectLedgerCollection.updateOne({ _id: item._id }, { $set: { device: component.device, area: component.area, equipment: component.equipment } })
            }
        }

        console.log('修复组件台账成功')
    } catch (err) {
        console.log('修复组件台账失败:' + err, "error")
    }
}

fixDetectLedger()
