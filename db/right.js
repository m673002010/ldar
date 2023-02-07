/**
{
    rightId: Number,
    authName: String,
    path: String,
    createTime: Date,
    updateTime: Date
}
 */
const rightCollection = mongoDb.collection('right')
module.exports = rightCollection
