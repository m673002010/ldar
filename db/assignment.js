/**
{
    companyNum: String,
    quarterCode: String,
    quarter: String, 
    year: String, 
    detectType: String,
    totalPoint: Number,
    assigned: Number,
    detected: Number,
    noDetected: Number,
    leakFix: Number,
    startDate: Date,
    endDate: Date,
    createDate: Date,
    createUser: Date,
}
 */
const assignmentCollection = mongoDb.collection('assignment')
module.exports = assignmentCollection
