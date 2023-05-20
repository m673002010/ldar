/**
{
    companyNum: String,
    detectionCycle: String,
    sealPoints: String,
    emissionBeforeRepair: String,
    emissionAfterRepair: String,
    decreaseAfterRepair: String,
    decreaseRateAfterRepair: String,
    startTime: String,
    endTime: String,
}
 */
const hesCollection = mongoDb.collection('historyEmissionStatistics')
module.exports = hesCollection
