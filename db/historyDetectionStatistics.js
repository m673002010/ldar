/**
{
    companyNum: String,
    detectionCycle: String,
    shouldDetect: String,
    hasDetect: String,
    leakPoint: String,
    finishRatio: String,
    leakRatio: String,
    emissionBeforeRepair: String,
    emissionAfterRepair: String,
    decrease: String,
}
 */
const hdsCollection = mongoDb.collection('historyDetectionStatistics')
module.exports = hdsCollection
