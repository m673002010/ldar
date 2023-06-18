/**
{
    companyNum: String,
	hesId: String,
    fileName: String,
    filePath: String,
    fileType: String,
	createDate: String,
    createUser: String,
}
 */
const hesProofCollection = mongoDb.collection('hesProof')
module.exports = hesProofCollection
