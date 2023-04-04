/**
{
    companyNum: String,
    componentTypeNum: String,
    componentType: String,
    calculationType: String,
    sealPointType: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const componentTypeCollection = mongoDb.collection('componentType')
module.exports = componentTypeCollection
