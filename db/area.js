/**
{
    companyNum: String,
    areaNum: String,
    area: String,
    deviceNum: String,
    device: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const areaCollection = mongoDb.collection('area')
module.exports = areaCollection
