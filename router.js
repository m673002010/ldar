const koaRouter = require('koa-router')
const router = new koaRouter()

// 用户
const userController = require('./controller/userController')
router.post('/api/user/register', userController.register)
router.post('/api/user/login', userController.login)
router.post('/api/user/reToken', userController.reToken)
router.get('/api/user/getUsers', userController.getUsers)
router.post('/api/user/addUser', userController.addUser)
router.post('/api/user/updateUser', userController.updateUser)
router.post('/api/user/deleteUser', userController.deleteUser)
router.post('/api/user/allocateRole', userController.allocateRole)
router.get('/api/user/userInfo', userController.userInfo)
router.get('/api/user/isAdmin', userController.isAdmin)

// 角色
const roleController = require('./controller/roleController')
router.get('/api/role/roleList', roleController.roleList)
router.post('/api/role/addRole', roleController.addRole)
router.post('/api/role/editRole', roleController.editRole)
router.get('/api/role/deleteRole', roleController.deleteRole)
router.post('/api/role/allocateRights', roleController.allocateRights)
router.get('/api/role/getRoleRights', roleController.getRoleRights)

// 权限
const rightController = require('./controller/rightController')
router.get('/api/right/rightTree', rightController.rightTree)
router.post('/api/right/addRight', rightController.addRight)
router.post('/api/right/editRight', rightController.editRight)
router.get('/api/right/deleteRight', rightController.deleteRight)

// 公司
const companyController = require('./controller/companyController')
router.get('/api/company/companyInfo', companyController.companyInfo)
router.get('/api/company/queryCompany', companyController.queryCompany)
router.post('/api/company/addCompany', companyController.addCompany)
router.post('/api/company/editCompany', companyController.editCompany)
router.post('/api/company/deleteCompany', companyController.deleteCompany)

// 数据面板
const dataPanelController = require('./controller/dataPanelController')
router.get('/api/dataPanel/pointStatic', dataPanelController.pointStatic)
router.get('/api/dataPanel/componentType', dataPanelController.componentType)
router.get('/api/dataPanel/sealPointType', dataPanelController.sealPointType)

// 首页
const firstPageController = require('./controller/firstPageController')
router.get('/api/firstPage/currentCycle', firstPageController.currentCycle)
router.get('/api/firstPage/allCycle', firstPageController.allCycle)

// 上传组件台账
const componentController = require('./controller/componentController')
router.get('/api/component/queryImportRecord', componentController.queryImportRecord)
router.post('/api/component/importComponent', componentController.importComponent)
router.post('/api/component/importComponentUni', componentController.importComponentUni)

// 上传图片台账
const pictureLedgerController = require('./controller/pictureLedgerController')
router.get('/api/pictureLedger/queryPicture', pictureLedgerController.queryPicture)
router.post('/api/pictureLedger/uploadPicture', pictureLedgerController.uploadPicture)
router.post('/api/pictureLedger/updatePicture', pictureLedgerController.updatePicture)
router.post('/api/pictureLedger/deletePicture', pictureLedgerController.deletePicture)
router.post('/api/pictureLedger/uploadPictureUni', pictureLedgerController.uploadPictureUni)
router.post('/api/pictureLedger/uploadPicArchive', pictureLedgerController.uploadPicArchive)

// 组件管理
router.get('/api/component/queryComponent', componentController.queryComponent)
router.post('/api/component/editComponent', componentController.editComponent)
router.post('/api/component/deleteComponent', componentController.deleteComponent)

// 装置管理
const deviceController = require('./controller/deviceController')
router.get('/api/device/queryDevice', deviceController.queryDevice)
router.post('/api/device/addDevice', deviceController.addDevice)
router.post('/api/device/editDevice', deviceController.editDevice)
router.post('/api/device/deleteDevice', deviceController.deleteDevice)

// 区域管理
const areaController = require('./controller/areaController')
router.get('/api/area/queryArea', areaController.queryArea)
router.post('/api/area/addArea', areaController.addArea)
router.post('/api/area/editArea', areaController.editArea)
router.post('/api/area/deleteArea', areaController.deleteArea)

// 设备管理
const equipmentController = require('./controller/equipmentController')
router.get('/api/equipment/queryEquipment', equipmentController.queryEquipment)
router.post('/api/equipment/addEquipment', equipmentController.addEquipment)
router.post('/api/equipment/editEquipment', equipmentController.editEquipment)
router.post('/api/equipment/deleteEquipment', equipmentController.deleteEquipment)

// 法规管理
const regulationController = require('./controller/regulationController')
router.get('/api/regulation/queryRegulation', regulationController.queryRegulation)
router.post('/api/regulation/addRegulation', regulationController.addRegulation)
router.post('/api/regulation/editRegulation', regulationController.editRegulation)
router.post('/api/regulation/deleteRegulation', regulationController.deleteRegulation)

router.get('/api/regulation/getRegulationComponent', regulationController.getRegulationComponent)
router.post('/api/regulation/addRegulationComponent', regulationController.addRegulationComponent)
router.post('/api/regulation/editRegulationComponent', regulationController.editRegulationComponent)
router.post('/api/regulation/deleteRegulationComponent', regulationController.deleteRegulationComponent)

router.get('/api/regulation/getBindRegulation', regulationController.getBindRegulation)
router.post('/api/regulation/bindRegulation', regulationController.bindRegulation)

router.post('/api/regulation/validate', regulationController.validate)

// 分配任务
const assignmentController = require('./controller/assignmentController')
router.get('/api/assignment/queryAssignment', assignmentController.queryAssignment)
router.post('/api/assignment/addAssignment', assignmentController.addAssignment)
router.post('/api/assignment/deleteAssignment', assignmentController.deleteAssignment)
router.get('/api/assignment/queryNoAssign', assignmentController.queryNoAssign)
router.post('/api/assignment/assign', assignmentController.assign)
router.get('/api/assignment/queryAssignDetail', assignmentController.queryAssignDetail)
router.post('/api/assignment/deleteAssign', assignmentController.deleteAssign)
router.post('/api/assignment/pick', assignmentController.pick)

// 获取检测人
router.get('/api/assignment/getDetectPeople', assignmentController.getDetectPeople)

// 下载检测任务
const ddtController = require('./controller/ddtController')
router.get('/api/downloadDetectionTask/queryTask', ddtController.queryTask)
router.get('/api/downloadDetectionTask/downloadTask', ddtController.downloadTask)
router.get('/api/downloadDetectionTask/queryQuarterCode', ddtController.queryQuarterCode)
router.get('/api/downloadDetectionTask/queryAssignNum', ddtController.queryAssignNum)

// 上传检测台账
const udlController = require('./controller/udlController')
router.post('/api/uploadDetectionLedger/uploadDetectTask', udlController.uploadDetectTask)

// 上传检测文件
const udfController = require('./controller/udfController')
router.get('/api/uploadDetectionLedger/queryDetectFile', udfController.queryDetectFile)
router.post('/api/uploadDetectionLedger/uploadDetectFile', udfController.uploadDetectFile)
router.post('/api/uploadDetectionLedger/deleteDetectFile', udfController.deleteDetectFile)

// 导出维修工单
const eroController = require('./controller/eroController')
router.post('/api/exportRepairOrder/queryRepairInfo', eroController.queryRepairInfo)
router.post('/api/exportRepairOrder/exportRetestTask', eroController.exportRetestTask)
router.post('/api/exportRepairOrder/exportWord', eroController.exportWord)

// 上传复测信息
const uriController = require('./controller/uriController')
router.get('/api/uploadRetestInfo/queryRetestInfo', uriController.queryRetestInfo)
router.post('/api/uploadRetestInfo/importRetestInfo', uriController.importRetestInfo)
router.post('/api/uploadRetestInfo/delayRepair', uriController.delayRepair)

// 组件信息台账
const cilController = require('./controller/cilController')
router.get('/api/cil/componentInfoLedger', cilController.componentInfoLedger)
router.get('/api/cil/exportComponentInfoLedger', cilController.exportComponentInfoLedger)

// 检测数据台账
const ddlController = require('./controller/ddlController')
router.post('/api/ddl/detectionDataLedger', ddlController.detectionDataLedger)
router.post('/api/ddl/exportDetectionDataLedger', ddlController.exportDetectionDataLedger)
router.post('/api/ddl/changeDetectValue', ddlController.changeDetectValue)

// 组件图片台账
const cplController = require('./controller/cplController')
router.get('/api/cpl/componentPictureLedger', cplController.componentPictureLedger)
router.get('/api/cpl/exportComponentPictureLedger', cplController.exportComponentPictureLedger)

// 泄露信息台账
const leakInfoLedgerController = require('./controller/leakInfoLedgerController')
router.post('/api/leakInfoLedger/queryLeakInfoLedger', leakInfoLedgerController.queryLeakInfoLedger)
router.post('/api/leakInfoLedger/exportLeakInfoLedger', leakInfoLedgerController.exportLeakInfoLedger)

// 历史排放统计
const hesController = require('./controller/hesController')
router.get('/api/hes/historyEmissionStatistics', hesController.historyEmissionStatistics)
router.post('/api/hes/addHes', hesController.addHes)
router.post('/api/hes/editHes', hesController.editHes)
router.post('/api/hes/deleteHes', hesController.deleteHes)
router.post('/api/hes/uploadProof', hesController.uploadProof)

// 历史检测统计
const hdsController = require('./controller/hdsController')
router.get('/api/hds/historyDetectionStatistics', hdsController.historyDetectionStatistics)
router.post('/api/hds/addHds', hdsController.addHds)
router.post('/api/hds/editHds', hdsController.editHds)
router.post('/api/hds/deleteHds', hdsController.deleteHds)

// 排放量计算报告
const ecrController = require('./controller/ecrController')
router.get('/api/ecr/emissionCalculationReport', ecrController.emissionCalculationReport)
router.post('/api/ecr/addEcr', ecrController.addEcr)
router.post('/api/ecr/editEcr', ecrController.editEcr)
router.post('/api/ecr/deleteEcr', ecrController.deleteEcr)

// 仪器校准记录单
const icrController = require('./controller/icrController')
router.post('/api/icr/instrumentCalibrationRecord', icrController.instrumentCalibrationRecord)
// router.post('/api/icr/addIcr', icrController.addIcr)
// router.post('/api/icr/editIcr', icrController.editIcr)
// router.post('/api/icr/deleteIcr', icrController.deleteIcr)

// 组件类型排放分析
const cteaController = require('./controller/cteaController')
router.get('/api/ctea/componentTypeEmissionAnalysis', cteaController.componentTypeEmissionAnalysis)
router.post('/api/ctea/statisticCtea', cteaController.statisticCtea)
router.post('/api/ctea/addCtea', cteaController.addCtea)
router.post('/api/ctea/editCtea', cteaController.editCtea)
router.post('/api/ctea/deleteCtea', cteaController.deleteCtea)

// 泄露区间分布
const leakIntervalController = require('./controller/leakIntervalController')
router.get('/api/leakInterval/queryLeakInterval', leakIntervalController.queryLeakInterval)
router.post('/api/leakInterval/statisticLeakInterval', leakIntervalController.statisticLeakInterval)
router.post('/api/leakInterval/addLeakInterval', leakIntervalController.addLeakInterval)
router.post('/api/leakInterval/editLeakInterval', leakIntervalController.editLeakInterval)
router.post('/api/leakInterval/deleteLeakInterval', leakIntervalController.deleteLeakInterval)

// 仪器管理
const instrumentController = require('./controller/instrumentController')
router.get('/api/instrument/queryInstrument', instrumentController.queryInstrument)
router.post('/api/instrument/addInstrument', instrumentController.addInstrument)
router.post('/api/instrument/editInstrument', instrumentController.editInstrument)
router.post('/api/instrument/deleteInstrument', instrumentController.deleteInstrument)

// 标气管理
const standardGasController = require('./controller/standardGasController')
router.get('/api/standardGas/queryStandardGas', standardGasController.queryStandardGas)
router.post('/api/standardGas/addStandardGas', standardGasController.addStandardGas)
router.post('/api/standardGas/editStandardGas', standardGasController.editStandardGas)
router.post('/api/standardGas/deleteStandardGas', standardGasController.deleteStandardGas)

// 校准管理
const calibrationController = require('./controller/calibrationController')
router.post('/api/calibration/queryCalibration', calibrationController.queryCalibration)
router.post('/api/calibration/addCalibration', calibrationController.addCalibration)
router.post('/api/calibration/deleteCalibration', calibrationController.deleteCalibration)

// 气象参数
const meteorologyParamController = require('./controller/meteorologyParamController')
router.post('/api/meteorologyParam/queryMeteorologyParam', meteorologyParamController.queryMeteorologyParam)
router.post('/api/meteorologyParam/addMeteorologyParam', meteorologyParamController.addMeteorologyParam)
router.post('/api/meteorologyParam/editMeteorologyParam', meteorologyParamController.editMeteorologyParam)
router.post('/api/meteorologyParam/deleteMeteorologyParam', meteorologyParamController.deleteMeteorologyParam)

// 装置类型
const deviceTypeController = require('./controller/deviceTypeController')
router.get('/api/deviceType/queryDeviceType', deviceTypeController.queryDeviceType)
router.post('/api/deviceType/addDeviceType', deviceTypeController.addDeviceType)
router.post('/api/deviceType/editDeviceType', deviceTypeController.editDeviceType)
router.post('/api/deviceType/deleteDeviceType', deviceTypeController.deleteDeviceType)

// 计算类型
const calculationTypeController = require('./controller/calculationTypeController')
router.get('/api/calculationType/queryCalculationType', calculationTypeController.queryCalculationType)
router.post('/api/calculationType/addCalculationType', calculationTypeController.addCalculationType)
router.post('/api/calculationType/editCalculationType', calculationTypeController.editCalculationType)
router.post('/api/calculationType/deleteCalculationType', calculationTypeController.deleteCalculationType)

// 组件类型
const componentTypeController = require('./controller/componentTypeController')
router.get('/api/componentType/queryComponentType', componentTypeController.queryComponentType)
router.post('/api/componentType/addComponentType', componentTypeController.addComponentType)
router.post('/api/componentType/editComponentType', componentTypeController.editComponentType)
router.post('/api/componentType/deleteComponentType', componentTypeController.deleteComponentType)

// 介质状态
const mediumController = require('./controller/mediumController')
router.get('/api/medium/queryMedium', mediumController.queryMedium)
router.post('/api/medium/addMedium', mediumController.addMedium)
router.post('/api/medium/editMedium', mediumController.editMedium)
router.post('/api/medium/deleteMedium', mediumController.deleteMedium)

// 仪器检测统计
const idsController = require('./controller/idsController')
router.post('/api/ids/importData', idsController.importData)
router.post('/api/ids/addIds', idsController.addIds)
router.post('/api/ids/editIds', idsController.editIds)
router.post('/api/ids/deleteIds', idsController.deleteIds)
router.get('/api/ids/instrumentDetectionStatistics', idsController.instrumentDetectionStatistics)
router.get('/api/ids/deleteData', idsController.deleteData)

module.exports = router
