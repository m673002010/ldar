/**
{
    companyNum: String,
    quarterCode: String,
    assginNum: String,
    employee: String, 
    assignPoint: Number, 
    labelExpandArr: Array,
    detected: Number, 
    noDetected: Number,
    leakFix: Number,
    isFinished: String,
    startDate: Date,
    endDate: Date,
    createDate: Date,
    createUser: Date,
}
 */
const assignOrderCollection = mongoDb.collection('assignOrder')
module.exports = assignOrderCollection
