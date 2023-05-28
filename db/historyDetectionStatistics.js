/**
{
    companyNum: String,
    detectionCycle: String,
    shouldDetect: String,
    hasDetect: String,
    leakPoint: String,
    emissionBeforeRepair: String,
    emissionAfterRepair: String,
    emissionDecrease: String
}
 */
const hdsCollection = mongoDb.collection('historyDetectionStatistics')
module.exports = hdsCollection
