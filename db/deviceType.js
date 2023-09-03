/**
{
    deviceTypeNum: String,
    type: String,
    deviceType: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const deviceTypeCollection = mongoDb.collection('deviceType')
module.exports = deviceTypeCollection
