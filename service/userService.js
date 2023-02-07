const userCollection = require('../db/user')
const roleCollection = require('../db/role')
const rightCollection = require('../db/right')
const rightService = require('../service/rightService')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const lodash = require('lodash')

async function createFirstAccount (ctx, next) {
    try {
        const userCount = await userCollection.count()
        if (userCount === 0) {
            const md5 = crypto.createHash('md5')
            const insertRes = await userCollection.insertOne({ 
                userId: 1,
                username: 'admin',
                password: md5.update('56728').digest('hex'),
                createTime: new Date(),
                updateTime: new Date()
            })

            return true
        }

        return false
    } catch(err) {
        console.log('createFirstAccount异常:', err)
        return false
    }
}

async function register (ctx, next) {
    try {
        const { username, password } = ctx.request.body
        const findRes = await userCollection.findOne({ username })
    
        if (findRes) {
            return { code: -1, message: '此用户名已注册' }
        }
    
        const md5 = crypto.createHash('md5')
        const users = await userCollection.find().sort({ createTime: -1 }).toArray()
        const insertRes = await userCollection.insertOne({
            userId: users[0].userId + 1,
            username,
            password: md5.update(password).digest('hex'),
            createTime: new Date(),
            updateTime: new Date()
        })
        
        return { code: 0 , message: '注册成功' }
    } catch (err) {
        console.log('register异常:', err)
        return { code: -1 , message: '注册异常' }
    }
}

async function login (ctx, next) {
    const { username, password } = ctx.request.body

    const user = await userCollection.findOne({ username })
    if (user) {
        const md5 = crypto.createHash('md5')
        const md5Password = md5.update(password).digest('hex')
        if (user.password !== md5Password) return { code: -1 , message: '密码错误' }

        // 签发 token，1天有效期
        const userInfo = { username, userId: user.userId }
        const token = jwt.sign(userInfo, config.privateKey, { expiresIn: '1d' }) 
        return { code: 0 , message: '登陆成功', data: { token } }

    } else return { code: -1 , message: '无此帐号' }
}

async function getUsers (ctx, next) {
    const { id = '', page = 1, size = 10 } = ctx.request.query

    const users = await userCollection.find().skip(+size * (+page - 1)).limit(+size).toArray()
    const total = await userCollection.count()

    const roleIdArr = lodash.compact(lodash.map(users, 'roleId'))

    if (roleIdArr.length > 0) {
        const roleArr = await roleCollection.find({ roleId: { $in: roleIdArr } }).toArray()

        users.forEach(user => {
            for (const role of roleArr) {
                if (user.roleId === role.roleId) Object.assign(user, { roleId: role.roleId, roleName: role.roleName })
            }
        })
    }

    return { code: 0 , message: '用户列表', data: { users, total } }
}

async function addUser (ctx, next) {
    try {
        const { username, password } = ctx.request.body
        const findRes = await userCollection.findOne({ username })
    
        if (findRes) {
            return { code: -1, message: '此用户名已注册' }
        }
    
        const md5 = crypto.createHash('md5')
        const users = await userCollection.find().sort({ createTime: -1 }).toArray()
        const insertRes = await userCollection.insertOne({
            userId: users[0].userId + 1,
            username,
            password: md5.update(password).digest('hex'),
            createTime: new Date(),
            updateTime: new Date()
        })
        
        return { code: 0 , message: '添加成功' }
    } catch (err) {
        console.log('addUser异常:', err)
        return { code: -1 , message: '添加异常' }
    }
}

async function updateUser (ctx, next) {
    try {
        const { userId, username, password } = ctx.request.body
    
        const md5 = crypto.createHash('md5')
        const newPasswd = md5.update(password).digest('hex')
        
        await userCollection.updateOne({ userId: +userId }, { $set: { username, password: newPasswd, updateTime: new Date() } })
        
        return { code: 0 , message: '修改成功' }
    } catch (err) {
        console.log('updateUser异常:', err)
        return { code: -1 , message: '修改异常' }
    }
}

async function deleteUser (ctx, next) {
    try {
        const { userId } = ctx.request.body
    
        await userCollection.deleteOne({ userId: +userId })
        
        return { code: 0 , message: '删除成功' }
    } catch (err) {
        console.log('deleteUser异常:', err)
        return { code: -1 , message: '删除异常' }
    }
}

async function allocateRole (ctx, next) {
    try {
        const { userId, roleId } = ctx.request.body
    
        await userCollection.updateOne({ userId: +userId }, { $set: { roleId: +roleId  } })
        
        return { code: 0 , message: '分配角色成功' }
    } catch (err) {
        console.log('allocateRole异常:', err)
        return { code: -1 , message: '分配角色失败' }
    }
}

async function userInfo (ctx, next) {
    try {
        const userInfo = ctx.userInfo

        const user = await userCollection.findOne({ userId: +userInfo.userId })
        const role = await roleCollection.findOne({ roleId: +user.roleId })
        let rights = []
        if (role) {
            rights = await rightCollection.find({ rightId: { $in: role.rightIds }}).toArray()
        }
        
        const rightTree = rightService.toTree(rights)
        Object.assign(userInfo, { rightTree })
        
        return { code: 0 , message: '获取用户信息成功', data: userInfo }
    } catch (err) {
        console.log('getUserInfo异常:', err)
        return { code: -1 , message: '获取用户信息失败' }
    }
}

module.exports = {
    createFirstAccount,
    register,
    login,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    allocateRole,
    userInfo
}
