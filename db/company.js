/**
{
    companyNum: String,
    fullName: String,
    shortName: String,
    province: String,
    city: String,
    createTime: Date,
    updateTime: Date
}
 */
const companyCollection = mongoDb.collection('company')
module.exports = companyCollection
