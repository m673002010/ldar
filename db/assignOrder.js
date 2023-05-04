/**
{
    companyNum: String,
    quarterCode: String,
    assginNum: String,
    detectPeople: String,
    assignedArr: Array, 
    detectedArr: Array,
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
