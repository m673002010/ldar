/**
{
    companyNum: String,
    year: String,
    quarter: String,
    instrumentNum: String,
    instrument: String,
    model: String,
    maintenance: String,
    quantity: String,
    calibrationUnit: String,
    certificateNum: String,
    description: String
}
 */
const iDSCollection = mongoDb.collection('instrumentDetectionStatistics')
module.exports = iDSCollection
