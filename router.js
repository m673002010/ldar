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

// 静态资源
const resourceController = require('./controller/resourceController')
router.get('/resource/onSitePicture', resourceController.onSitePicture)

module.exports = router
