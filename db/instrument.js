/**
{
    companyNum: String,
    serialNumber: String,
    testInstrument: String,
    finalPrecisionTime: Date,
    responseTime: String,
    invalidTime: Date,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const instrumentCollection = mongoDb.collection('instrument')
module.exports = instrumentCollection
