/**
{
    companyNum: String,
    quarterCode: String,
    repairBeforeAfter: String,
    device: String, 
    deviceType: String,
    area: String, 
    equipment: String,
    componentType: String,
    mediumStatus: String,
    count: Number,
    leakRate: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const ecrCollection = mongoDb.collection('emissionCalculationReport')
module.exports = ecrCollection
