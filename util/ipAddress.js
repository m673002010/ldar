// 本地node环境下运行!!!!
const os = require('os')
///获取本机ip///
function getIPAdress(flag = false) {
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
        const iface = interfaces[devName]
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i]
            let isIPV4 = flag ? false : true
            if (isIPV4) {
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address
                }
            } else if (alias.address !== '127.0.0.1' && !alias.internal) {
                if (alias.family === 'IPv6') {
                    return alias.address
                }
            }
 
        }
    }
}
 
module.exports = {
    getIPAdress
}
 
 
// 使用的时候
 
// const util = require('./util')
// util.getIPAdress()  // IPv4
// util.getIPAdress(true)  // IPv6
