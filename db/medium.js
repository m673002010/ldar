/**
{
    mediumNum: String,
    medium: String,
    report: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const mediumCollection = mongoDb.collection('medium')
module.exports = mediumCollection
