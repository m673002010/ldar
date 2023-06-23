/**
{
    companyNum: String,
    quarterCode: String,
    sealPointType: String,
    detectionCount: String, 
    leakCount: String,
    repairCount: String, 
    leakRate: String,
    leakRateAfterRepair: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const cteaCollection = mongoDb.collection('componentTypeEmissionAnalysis')
module.exports = cteaCollection
