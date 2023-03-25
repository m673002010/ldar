
async function instrumentCalibrationRecord (ctx, next) {
    try {
        
        ctx.body = { code: 0 , message: '查询数据成功', data: [] }
    } catch (err) {
        logger.log('instrumentCalibrationRecord异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}


module.exports = {
    instrumentCalibrationRecord,
}
