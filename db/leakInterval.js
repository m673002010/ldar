/**
{
    companyNum: String,
    quarterCode: String,
    device: String,
    detectionCount: String, 
    ppm100to500: String,
    ppm500to2000: String, 
    ppm2000to10000: String,
    ppmMoreThan10000: String,
    delayFix: String,
    haveFixed: String,
    nofixed: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const leakIntervalCollection = mongoDb.collection('leakInterval')
module.exports = leakIntervalCollection
