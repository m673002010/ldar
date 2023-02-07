/**
{
    userId: Number,
    username: String,
    password: String,
    roles: Array,
    createTime: Date,
    updateTime: Date
}
 */
const userCollection = mongoDb.collection('user')
module.exports = userCollection
