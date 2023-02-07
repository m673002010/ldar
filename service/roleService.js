const roleCollection = require('../db/role')
const rightCollection = require('../db/right')
const lodash = require('lodash')

async function roleList (ctx) {
    const roles =  await roleCollection.find().sort({ creatTime: -1 }).toArray()

    return { code: 0 , message: '角色列表', data: roles }
}

async function addRole (ctx) {
    try {
        const { roleName, desc } = ctx.request.body

        const res = await roleCollection.find().sort({ roleId: -1 }).toArray()
        const roleId = res && res.length ? res[0].roleId + 1 : 1

        const role = { roleId, roleName, desc, rightIds: [], createTime: new Date(), updateTime: new Date() }
        await roleCollection.insertOne(role)
        
        return { code: 0 , message: '角色添加成功'}
    } catch (err) {
        console.log('addRole异常:', err)
        return { code: -1 , message: 'addRole异常' }
    }
}

async function editRole (ctx) {
    try {
        const { roleId, roleName, desc } = ctx.request.body

        await roleCollection.updateOne({ roleId: +roleId }, { $set: { roleName, desc, updateTime: new Date() } })
    
        return { code: 0 , message: '角色编辑成功' }
    } catch (err) {
        console.log('editRole异常:', err)
        return { code: -1 , message: 'editRole异常' }
    }
}

async function deleteRole (ctx, next) {
    try {
        const { roleId } = ctx.request.query

        await roleCollection.deleteOne({ roleId: +roleId})
        
        return { code: 0 , message: '删除成功'}
    } catch (err) {
        console.log('deleteRole异常:', err)
        return { code: -1 , message: 'deleteRole异常' }
    }
}

async function allocateRights (ctx, next) {
    try {
        const { roleId, rightIds = [] } = ctx.request.body

        if (rightIds) {
            const idArr = rightIds.map(Number)
            await roleCollection.updateOne({ roleId: +roleId }, { $set: { rightIds: idArr, updateTime: new Date() } })
            
            return { code: 0 , message: '更新权限成功'}
        } 
    } catch (err) {
        console.log('allocateRights异常:', err)
        return { code: -1 , message: 'allocateRights异常' }
    }
}

async function getRoleRights (ctx, next) {
    try {
        const { roleId } = ctx.request.query

        const role = await roleCollection.findOne({ roleId: +roleId })
        const rightIds = role.rightIds || []
        const rights = await rightCollection.find({ rightId: { $in: rightIds } }).toArray()

        return { code: 0 , message: '获取角色权限成功', data: rights}
    } catch (err) {
        console.log('getRoleRights异常:', err)
        return { code: -1 , message: 'getRoleRights异常' }
    }
}

module.exports = {
    roleList,
    addRole,
    editRole,
    deleteRole,
    allocateRights,
    getRoleRights
}
