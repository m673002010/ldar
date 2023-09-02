/**
{
    companyNum: String,
	quarterCode: String,
	assignNum: String,
    labelExpand: String,
	device: String,
	area: String,
	equipment: String,
	label: String,
	expand: String,
	detectDate: Date,
	startDate: Date,
	endDate: Date,
	// runTime: String,
	detectPeople: String,
	instrument: String,
	backgroundValue: String,
	detectValue: String,
}
 */
const leakLedgerCollection = mongoDb.collection('leakLedger')
module.exports = leakLedgerCollection
