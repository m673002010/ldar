/**
{
    companyNum: String,
    quarterCode: String,
    quarter: String, 
    year: String, 
    detectType: String, 
    assigned: String, 
    detected: String,
    noDetected: String,
    leakFix: String,
    totalPoint: String,
    startDate: Date,
    endDate: Date,
    createDate: String,
    createUser: String,
}
 */
const assignmentCollection = mongoDb.collection('assignment')
module.exports = assignmentCollection
