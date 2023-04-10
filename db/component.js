/**
{
    companyNum: String,
    labelExpand: String,
    device: String, 
    area: String, 
    equipment: String, 
    label: String, 
    expand: String,
    componentType: String,
    pid: String,
    reference: String,
    location: String,
    distance: String,
    floor: String,
    high: String,
    description: String,
    size: String,
    unreachable: String,
    reason: String,
    medium: String,
    mediumStatus: String,
    quantity: String,
}
 */
const componentCollection = mongoDb.collection('component')
module.exports = componentCollection
