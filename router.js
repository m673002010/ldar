const koaRouter = require('koa-router')
const router = new koaRouter()

// 用户
const userController = require('./controller/userController')
router.post('/user/register', userController.register)
router.post('/user/login', userController.login)
router.get('/user/getUsers', userController.getUsers)
router.post('/user/addUser', userController.addUser)
router.post('/user/updateUser', userController.updateUser)
router.post('/user/deleteUser', userController.deleteUser)
router.post('/user/allocateRole', userController.allocateRole)
router.get('/user/userInfo', userController.userInfo)

// 角色
const roleController = require('./controller/roleController')
router.get('/role/roleList', roleController.roleList)
router.post('/role/addRole', roleController.addRole)
router.post('/role/editRole', roleController.editRole)
router.get('/role/deleteRole', roleController.deleteRole)
router.post('/role/allocateRights', roleController.allocateRights)
router.get('/role/getRoleRights', roleController.getRoleRights)

// 权限
const rightController = require('./controller/rightController')
router.get('/right/rightTree', rightController.rightTree)
router.post('/right/addRight', rightController.addRight)
router.post('/right/editRight', rightController.editRight)
router.get('/right/deleteRight', rightController.deleteRight)

// 公司
const companyController = require('./controller/companyController')
router.get('/company/companyInfo', companyController.companyInfo)
router.get('/company/searchCompany', companyController.searchCompany)
router.get('/company/dataPanel', companyController.dataPanel)
router.get('/company/getBindRegulation', companyController.getBindRegulation)
router.post('/company/bindRegulation', companyController.bindRegulation)

// 组件管理
const componentController = require('./controller/componentController')
router.get('/component/queryComponent', componentController.queryComponent)
router.get('/component/queryImportRecord', componentController.queryImportRecord)
router.post('/component/importComponent', componentController.importComponent)
router.post('/component/editComponent', componentController.editComponent)
router.post('/component/deleteComponent', componentController.deleteComponent)

// 上传图片台账
const pictureLedgerController = require('./controller/pictureLedgerController')
router.get('/pictureLedger/queryPicture', pictureLedgerController.queryPicture)
router.post('/pictureLedger/uploadPicture', pictureLedgerController.uploadPicture)
router.post('/pictureLedger/deletePicture', pictureLedgerController.deletePicture)

// 装置管理
const deviceController = require('./controller/deviceController')
router.get('/device/queryDevice', deviceController.queryDevice)
router.post('/device/addDevice', deviceController.addDevice)
router.post('/device/editDevice', deviceController.editDevice)
router.post('/device/deleteDevice', deviceController.deleteDevice)

// 区域管理
const areaController = require('./controller/areaController')
router.get('/area/queryArea', areaController.queryArea)
router.post('/area/addArea', areaController.addArea)
router.post('/area/editArea', areaController.editArea)
router.post('/area/deleteArea', areaController.deleteArea)

// 设备管理
const equipmentController = require('./controller/equipmentController')
router.get('/equipment/queryEquipment', equipmentController.queryEquipment)
router.post('/equipment/addEquipment', equipmentController.addEquipment)
router.post('/equipment/editEquipment', equipmentController.editEquipment)
router.post('/equipment/deleteEquipment', equipmentController.deleteEquipment)

// 组件信息台账
const cilController = require('./controller/cilController')
router.get('/cil/componentInfoLedger', cilController.componentInfoLedger)

// 法规管理
const regulationController = require('./controller/regulationController')
router.get('/regulation/queryRegulation', regulationController.queryRegulation)
router.post('/regulation/addRegulation', regulationController.addRegulation)
router.post('/regulation/editRegulation', regulationController.editRegulation)
router.post('/regulation/deleteRegulation', regulationController.deleteRegulation)

// 检测数据台账
const ddlController = require('./controller/ddlController')
router.get('/ddl/detectionDataLedger', ddlController.detectionDataLedger)

// 组件图片台账
const cplController = require('./controller/cplController')
router.get('/cpl/componentPictureLedger', cplController.componentPictureLedger)

// 泄露信息台账
const leakInfoLedgerController = require('./controller/leakInfoLedgerController')
router.get('/leakInfoLedger/queryLeakInfoLedger', leakInfoLedgerController.queryLeakInfoLedger)

// 历史排放统计
const hesController = require('./controller/hesController')
router.get('/hes/historyEmissionStatistics', hesController.historyEmissionStatistics)

// 排放量计算报告
const ecrController = require('./controller/ecrController')
router.get('/ecr/emissionCalculationReport', ecrController.emissionCalculationReport)

// 仪器校准记录单
const icrController = require('./controller/icrController')
router.get('/icr/instrumentCalibrationRecord', icrController.instrumentCalibrationRecord)

// 历史检测统计
const hdsController = require('./controller/hdsController')
router.get('/hds/historyDetectionStatistics', hdsController.historyDetectionStatistics)

// 组件类型排放分析
const cteaController = require('./controller/cteaController')
router.get('/ctea/componentTypeEmissionAnalysis', cteaController.componentTypeEmissionAnalysis)

// 泄露区间分布
const leakIntervalController = require('./controller/leakIntervalController')
router.get('/leakInterval/queryLeakInterval', leakIntervalController.queryLeakInterval)

// 仪器管理
const instrumentController = require('./controller/instrumentController')
router.get('/instrument/queryInstrument', instrumentController.queryInstrument)
router.post('/instrument/addInstrument', instrumentController.addInstrument)
router.post('/instrument/editInstrument', instrumentController.editInstrument)
router.post('/instrument/deleteInstrument', instrumentController.deleteInstrument)

// 标气管理
const standardGasController = require('./controller/standardGasController')
router.get('/standardGas/queryStandardGas', standardGasController.queryStandardGas)
router.post('/standardGas/addStandardGas', standardGasController.addStandardGas)
router.post('/standardGas/editStandardGas', standardGasController.editStandardGas)
router.post('/standardGas/deleteStandardGas', standardGasController.deleteStandardGas)

// 校准管理
const calibrationController = require('./controller/calibrationController')
router.post('/calibration/queryCalibration', calibrationController.queryCalibration)
router.post('/calibration/importCalibration', calibrationController.importCalibration)
router.post('/calibration/deleteCalibration', calibrationController.deleteCalibration)

// 气象参数
const meteorologyParamController = require('./controller/meteorologyParamController')
router.post('/meteorologyParam/queryMeteorologyParam', meteorologyParamController.queryMeteorologyParam)
router.post('/meteorologyParam/addMeteorologyParam', meteorologyParamController.addMeteorologyParam)
router.post('/meteorologyParam/editMeteorologyParam', meteorologyParamController.editMeteorologyParam)
router.post('/meteorologyParam/deleteMeteorologyParam', meteorologyParamController.deleteMeteorologyParam)

// 装置类型
const deviceTypeController = require('./controller/deviceTypeController')
router.get('/deviceType/queryDeviceType', deviceTypeController.queryDeviceType)
router.post('/deviceType/addDeviceType', deviceTypeController.addDeviceType)
router.post('/deviceType/editDeviceType', deviceTypeController.editDeviceType)
router.post('/deviceType/deleteDeviceType', deviceTypeController.deleteDeviceType)

// 计算类型
const calculationTypeController = require('./controller/calculationTypeController')
router.get('/calculationType/queryCalculationType', calculationTypeController.queryCalculationType)
router.post('/calculationType/addCalculationType', calculationTypeController.addCalculationType)
router.post('/calculationType/editCalculationType', calculationTypeController.editCalculationType)
router.post('/calculationType/deleteCalculationType', calculationTypeController.deleteCalculationType)

// 组件类型
const componentTypeController = require('./controller/componentTypeController')
router.get('/componentType/queryComponentType', componentTypeController.queryComponentType)
router.post('/componentType/addComponentType', componentTypeController.addComponentType)
router.post('/componentType/editComponentType', componentTypeController.editComponentType)
router.post('/componentType/deleteComponentType', componentTypeController.deleteComponentType)

// 介质状态
const MediumController = require('./controller/mediumController')
router.get('/medium/queryMedium', MediumController.queryMedium)
router.post('/medium/addMedium', MediumController.addMedium)
router.post('/medium/editMedium', MediumController.editMedium)
router.post('/medium/deleteMedium', MediumController.deleteMedium)

// 仪器检测统计
const idsController = require('./controller/idsController')
router.post('/ids/importData', idsController.importData)
router.get('/ids/instrumentDetectionStatistics', idsController.instrumentDetectionStatistics)
router.get('/ids/deleteData', idsController.deleteData)

// 静态资源
const resourceController = require('./controller/resourceController')
router.get('/resource/onSitePicture', resourceController.onSitePicture)

module.exports = router
