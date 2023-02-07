const rightCollection = require('../db/right')
const lodash = require('lodash')

async function rightTree (ctx, next) {
    try {
        let data = await rightCollection.find().toArray()

        data = toTree(data)
        
        return { code: 0 , message: '权限树', data }
    } catch (err) {
        console.log('rightTree异常:', err)
        return { code: -1 , message: 'rightTree异常' }
    }
}

function toTree(data) {
    const result = []
    if(!Array.isArray(data)) {
        return result
    }

    const map = {}
    data.forEach(item => {
        map[item.rightId] = item
    })

    data.forEach(item => {
        const parent = map[item.parentId]
        if (parent) {
            if (!parent.children) parent.children = []
            parent.children.push(item)
        } else {
            result.push(item)
        }
    })

    return result
}

async function addRight (ctx, next) {
    try {
        const { parentId = 0, authType, authName, path } = ctx.request.body

        const res = await rightCollection.find().sort({ rightId: -1 }).toArray()
        const rightId = res && res.length ? res[0].rightId + 1 : 1

        const right = { rightId, authType: +authType, authName, path, createTime: new Date(), updateTime: new Date() }
        if (+parentId) Object.assign(right, { parentId: +parentId })
        await rightCollection.insertOne(right)
        
        return { code: 0 , message: '添加成功'}
    } catch (err) {
        console.log('addRight异常:', err)
        return { code: -1 , message: 'addRight异常' }
    }
}

async function editRight (ctx, next) {
    try {
        const { rightId, authType, authName, path } = ctx.request.body
        await rightCollection.updateOne({ rightId: +rightId }, { $set: { authType: +authType, authName, path, updateTime: new Date() } })
        
        return { code: 0 , message: '编辑成功'}
    } catch (err) {
        console.log('editRight异常:', err)
        return { code: -1 , message: 'editRight异常' }
    }
}

async function deleteRight (ctx, next) {
    try {
        const { rightId } = ctx.request.query

        const ids = await childrenIds(+rightId)
        ids.push(+rightId)
        await rightCollection.deleteMany({ rightId: { $in: ids } })
        
        return { code: 0 , message: '删除成功'}
    } catch (err) {
        console.log('deleteRight异常:', err)
        return { code: -1 , message: 'deleteRight异常' }
    }
}

async function childrenIds (rightId) {
    let arr = []
    const res = await rightCollection.find({ parentId: +rightId }).toArray()
    if (res && res.length) {
        const rightIds = lodash.map(res, 'rightId')
        arr = arr.concat(rightIds)
        for (const rightId of rightIds) {
            arr = arr.concat(await childrenIds(rightId))
        }
    }
    return arr
}

module.exports = {
    rightTree,
    addRight,
    editRight,
    deleteRight,
    toTree
}
