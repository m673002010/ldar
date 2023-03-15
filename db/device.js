/**
{
    companyNum: String,
    deviceNum: String,
    device: String,
    deviceType: String,
    department: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const deviceCollection = mongoDb.collection('device')
module.exports = deviceCollection
