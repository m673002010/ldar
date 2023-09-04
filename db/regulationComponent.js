/**
{
    regulationCode: String,
    regulation: String,
    componentType: String,
    mediumStatus: String,
    quarter: String,
    threshold: Number,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const regulationComponentCollection = mongoDb.collection('regulationComponent')
module.exports = regulationComponentCollection
