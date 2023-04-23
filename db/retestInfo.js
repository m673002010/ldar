/**
{
    device: String,
    area: String,
    equipment: String,
    labelExpand: String,
    label: String,
    expand: String,
    repairPeople: String,
    repairCount: String,
    repairEndDate: Date,
    repairUseTime: String,
    retestStartDate: Date,
    retestEndDate: Date,
    retestInstrument: String,
    retestPeople: String,
    retestValue: String,
    retestBackgroundValue: String,
    isDelayRepair: String,
    delayRepairReason: String,
    planRepairDate: Date,
}
 */
const retestInfoCollection = mongoDb.collection('retestInfo')
module.exports = retestInfoCollection
