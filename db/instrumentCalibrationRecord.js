/**
{
    companyNum: String,
    calibrationDate: Date, 
    instrument: String,
    dailyCalibration0: String, 
    dailyCalibration500: String,
    dailyCalibration10K: String,
    driftCalibration500: String,
    driftCalibration10K: String,
    isCalibration: String,
    calibrationPeople: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const icrCollection = mongoDb.collection('instrumentCalibrationRecord')
module.exports = icrCollection
