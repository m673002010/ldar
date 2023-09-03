/**
{
    date: Date,
    temperature: String,
    humidity: String,
    barometricPressure: String,
    windDirection: String,
    windSpeed: String,
    createDate: Date,
    createUser: String,
    editDate: Date,
    editUser: String,
}
 */
const meteorologyParamCollection = mongoDb.collection('meteorologyParam')
module.exports = meteorologyParamCollection
