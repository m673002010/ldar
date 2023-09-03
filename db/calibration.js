/**
{
    calibrationDate: String,
    calibrationPeople: String,
    instrumentNum: Date,
    zeroAirReading_1: String,
    zeroAirReading_2: String,
    zeroAirReading_3: String,
    calibrationGasReading_1: String,
    calibrationGasReading_2: String,
    calibrationGasReading_3: String,
    responseTime_1_1: String,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const calibrationCollection = mongoDb.collection('calibration')
module.exports = calibrationCollection
