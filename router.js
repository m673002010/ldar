const koaRouter = require('koa-router')
const router = new koaRouter()

// 用户
const userController = require('./controller/userController')
router.post('/user/register', userController.register)
router.post('/user/login', userController.login)
router.post('/user/reToken', userController.reToken)
router.get('/user/getUsers', userController.getUsers)
router.post('/user/addUser', userController.addUser)
router.post('/user/updateUser', userController.updateUser)
router.post('/user/deleteUser', userController.deleteUser)
router.post('/user/allocateRole', userController.allocateRole)
router.get('/user/userInfo', userController.userInfo)
router.get('/user/isAdmin', userController.isAdmin)

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
router.get('/company/dataPanel', companyController.dataPanel)
router.get('/company/getBindRegulation', companyController.getBindRegulation)
router.post('/company/bindRegulation', companyController.bindRegulation)

// 数据面板
const dataPanelController = require('./controller/dataPanelController')
router.get('/dataPanel/pointStatic', dataPanelController.pointStatic)
router.get('/dataPanel/componentType', dataPanelController.componentType)
router.get('/dataPanel/sealPointType', dataPanelController.sealPointType)

// 首页
const firstPageController = require('./controller/firstPageController')
router.get('/firstPage/currentCycle', firstPageController.currentCycle)
router.get('/firstPage/allCycle', firstPageController.allCycle)

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

// 法规管理
const regulationController = require('./controller/regulationController')
router.get('/regulation/queryRegulation', regulationController.queryRegulation)
router.post('/regulation/addRegulation', regulationController.addRegulation)
router.post('/regulation/editRegulation', regulationController.editRegulation)
router.post('/regulation/deleteRegulation', regulationController.deleteRegulation)

router.get('/regulation/getRegulationComponent', regulationController.getRegulationComponent)
router.post('/regulation/addRegulationComponent', regulationController.addRegulationComponent)
router.post('/regulation/editRegulationComponent', regulationController.editRegulationComponent)
router.post('/regulation/deleteRegulationComponent', regulationController.deleteRegulationComponent)

router.post('/regulation/validate', regulationController.validate)

// 分配任务
const assignmentController = require('./controller/assignmentController')
router.get('/assignment/queryAssignment', assignmentController.queryAssignment)
router.post('/assignment/addAssignment', assignmentController.addAssignment)
router.post('/assignment/deleteAssignment', assignmentController.deleteAssignment)
router.get('/assignment/queryNoAssign', assignmentController.queryNoAssign)
router.post('/assignment/assign', assignmentController.assign)
router.get('/assignment/queryAssignDetail', assignmentController.queryAssignDetail)
router.post('/assignment/deleteAssign', assignmentController.deleteAssign)

// 下载检测任务
const ddtController = require('./controller/ddtController')
router.get('/downloadDetectionTask/queryTask', ddtController.queryTask)
router.get('/downloadDetectionTask/downloadTask', ddtController.downloadTask)
router.get('/downloadDetectionTask/queryQuarterCode', ddtController.queryQuarterCode)
router.get('/downloadDetectionTask/queryAssignNum', ddtController.queryAssignNum)

// 上传检测台账
const udlController = require('./controller/udlController')
router.post('/uploadDetectionLedger/uploadDetectTask', udlController.uploadDetectTask)

// 上传检测文件
const udfController = require('./controller/udfController')
router.get('/uploadDetectionLedger/queryDetectFile', udfController.queryDetectFile)
router.post('/uploadDetectionLedger/uploadDetectFile', udfController.uploadDetectFile)
router.post('/uploadDetectionLedger/deleteDetectFile', udfController.deleteDetectFile)

// 导出维修工单
const eroController = require('./controller/eroController')
router.post('/exportRepairOrder/queryRepairInfo', eroController.queryRepairInfo)
router.post('/exportRepairOrder/exportRetestTask', eroController.exportRetestTask)

// 上传复测信息
const uriController = require('./controller/uriController')
router.get('/uploadRetestInfo/queryRetestInfo', uriController.queryRetestInfo)
router.post('/uploadRetestInfo/importRetestInfo', uriController.importRetestInfo)

// 组件信息台账
const cilController = require('./controller/cilController')
router.get('/cil/componentInfoLedger', cilController.componentInfoLedger)
router.get('/cil/exportComponentInfoLedger', cilController.exportComponentInfoLedger)

// 检测数据台账
const ddlController = require('./controller/ddlController')
router.post('/ddl/detectionDataLedger', ddlController.detectionDataLedger)
router.post('/ddl/exportDetectionDataLedger', ddlController.exportDetectionDataLedger)

// 组件图片台账
const cplController = require('./controller/cplController')
router.get('/cpl/componentPictureLedger', cplController.componentPictureLedger)
router.get('/cpl/exportComponentPictureLedger', cplController.exportComponentPictureLedger)

// 泄露信息台账
const leakInfoLedgerController = require('./controller/leakInfoLedgerController')
router.post('/leakInfoLedger/queryLeakInfoLedger', leakInfoLedgerController.queryLeakInfoLedger)
router.post('/leakInfoLedger/exportLeakInfoLedger', leakInfoLedgerController.exportLeakInfoLedger)

// 历史排放统计
const hesController = require('./controller/hesController')
router.get('/hes/historyEmissionStatistics', hesController.historyEmissionStatistics)
router.post('/hes/addHes', hesController.addHes)
router.post('/hes/editHes', hesController.editHes)
router.post('/hes/deleteHes', hesController.deleteHes)
router.post('/hes/uploadProof', hesController.uploadProof)

// 排放量计算报告
const ecrController = require('./controller/ecrController')
router.get('/ecr/emissionCalculationReport', ecrController.emissionCalculationReport)
router.post('/ecr/addEcr', ecrController.addEcr)
router.post('/ecr/editEcr', ecrController.editEcr)
router.post('/ecr/deleteEcr', ecrController.deleteEcr)

// 仪器校准记录单
const icrController = require('./controller/icrController')
router.post('/icr/instrumentCalibrationRecord', icrController.instrumentCalibrationRecord)
router.post('/icr/addIcr', icrController.addIcr)
router.post('/icr/editIcr', icrController.editIcr)
router.post('/icr/deleteIcr', icrController.deleteIcr)

// 历史检测统计
const hdsController = require('./controller/hdsController')
router.get('/hds/historyDetectionStatistics', hdsController.historyDetectionStatistics)
router.post('/hds/addHds', hdsController.addHds)
router.post('/hds/editHds', hdsController.editHds)
router.post('/hds/deleteHds', hdsController.deleteHds)

// 组件类型排放分析
const cteaController = require('./controller/cteaController')
router.get('/ctea/componentTypeEmissionAnalysis', cteaController.componentTypeEmissionAnalysis)
router.post('/ctea/addCtea', cteaController.addCtea)
router.post('/ctea/editCtea', cteaController.editCtea)
router.post('/ctea/deleteCtea', cteaController.deleteCtea)

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
