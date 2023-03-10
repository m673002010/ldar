/**
{
    companyNum: String,
    calculationTypeNum: String,
    calculationType: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const calculationTypeCollection = mongoDb.collection('calculationType')
module.exports = calculationTypeCollection
