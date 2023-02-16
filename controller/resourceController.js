async function onSitePicture (ctx, next) {
    // 读取目录下所有目录文件，返回数组
    let fileArr = fs.readdirSync(path.join(__dirname,'../static/'),{ encoding:'utf8', withFileTypes:true })
        
    let pathNameArr = []
        
    // 遍历 fileArr ,获取每个图片文件的内容，并存入数组
    fileArr.forEach(item => {
        // 将图片文件路径拼接为 域名+目录（前面设置的静态资源目录）+文件名 的格式
        let filePath = `http://localhost:8000/img/swiper/${item.name}`
        // 存入数组
        pathNameArr.push(file)
    })

    ctx.body = {
        code: 0,
        message: "获取轮播图成功",
        result: pathNameArr
    }
}

module.exports = {
    onSitePicture
}
