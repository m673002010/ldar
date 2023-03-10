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
