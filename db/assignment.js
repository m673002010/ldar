/**
{
    companyNum: String,
    quarterCode: String,
    quarter: String, 
    year: String, 
    detectType: String,
    labelExpandArr: Arrary,
    assignedArr: Arrary,
    detectedArr: Arrary,
    leakFixArr: Arrary,
    startDate: Date,
    endDate: Date,
    createDate: Date,
    createUser: Date,
}
 */
const assignmentCollection = mongoDb.collection('assignment')
module.exports = assignmentCollection
