/**
{
    companyNum: String,
    quarterCode: String,
    assginNum: String,
    employee: String,
    assignedArr: Array, 
    detectedArr: Array, 
    unDetectedArr: Array,
    leakFixArr: Array,
    isFinished: String,
    startDate: Date,
    endDate: Date,
    createDate: Date,
    createUser: Date,
}
 */
const assignOrderCollection = mongoDb.collection('assignOrder')
module.exports = assignOrderCollection
