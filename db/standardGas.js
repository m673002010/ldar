/**
{
    companyNum: String,
    standardGasNum: String,
    standardGas: String,
    dailyCalibration: String,
    needDriftCalibration: String,
    type: String,
    standardGasActual: String,
    standardGasTheory: String,
    validTime: Date,
    stopUse: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const standardGasCollection = mongoDb.collection('standardGas')
module.exports = standardGasCollection
