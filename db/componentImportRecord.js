/**
{
    companyNum: String,
    importFile: String, 
    newCount: Number,
    createDate: Date,
    createUser: String,
}
 */
const cirCollection = mongoDb.collection('componentImportRecord')
module.exports = cirCollection
