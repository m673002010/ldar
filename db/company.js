/**
{
    companyNum: String,
    fullName: String,
    shortName: String,
    province: String,
    city: String,
    createDate: Date,
    updateDate: Date
}
 */
const companyCollection = mongoDb.collection('company')
module.exports = companyCollection
