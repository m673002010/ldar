/**
{
    regulationCode: String,
    regulation: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const regulationCollection = mongoDb.collection('regulation')
module.exports = regulationCollection
