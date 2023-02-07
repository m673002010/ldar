/**
{
    roleId: Number,
    rolename: String,
    rights: Array,
    createTime: Date,
    updateTime: Date
}
 */
const roleCollection = mongoDb.collection('role')
module.exports = roleCollection
