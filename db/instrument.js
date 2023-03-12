/**
{
    companyNum: String,
    serialNumber: String,
    testInstrument: String,
    finalPrecisionTime: String,
    responseTime: String,
    invalidTime: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const instrumentCollection = mongoDb.collection('instrument')
module.exports = instrumentCollection
