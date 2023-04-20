/**
{
    companyNum: String,
	year: String,
	quarter: String,
    fileName: String,
    filePath: String,
    fileType: String,
	createDate: String,
    createUser: String,
}
 */
const detectFileCollection = mongoDb.collection('detectFile')
module.exports = detectFileCollection
