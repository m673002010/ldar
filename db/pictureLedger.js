/**
{
    companyNum: String,
    picture: String,
    picturePath: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const pictureLedgerCollection = mongoDb.collection('pictureLedger')
module.exports = pictureLedgerCollection
