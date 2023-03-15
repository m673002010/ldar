/**
{
    companyNum: String,
    equipmentNum: String,
    equipment: String,
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
const equipmentCollection = mongoDb.collection('equipment')
module.exports = equipmentCollection
