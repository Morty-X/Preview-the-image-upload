(function (window) {
    let wrapContent = document.querySelector('.wrap-content')
    let wrapContentAdd = document.querySelector('.wrap-content-add')
    // 获取大图预览图
    let bigPreviewImg = document.querySelector('.bigPreviewImg')
    let bigPreviewsmallImg = bigPreviewImg.querySelector('.pimg')
    let ashIcon = bigPreviewImg.querySelector('span')
    ashIcon.addEventListener('click', function (e) {
        bigPreviewImg.style.display = 'none'
    })
    //由于用户删除预览图片后预览图片的数据需要同步更改，所以用户上传的图片文件需要被记录起来，
    let fileMap = {}
    // 事件委托
    /**
     * 1.点击`+`号方框可以打开文件资源管理器选择文件。
     * 2.选择好文件资源管理器中的`image`类型的文件可以将它插入到页面中（注意插入的时候实在第一个之前插入）。然后`+`号方框往后移动
    */
    wrapContentAdd.addEventListener('click', function (e) {
        let p = showOpenFilePicker()
        p.then(function (res) {
            // console.log(res[0].getFile());
            return res[0].getFile()
        }).then(function (fileObj) {
            console.log(fileObj);

            // 这里的content返回的就是一个文件 File 对象实例了
            const objectURL = window.URL.createObjectURL(fileObj);
            // 创建一个装img的盒子 wrap-content-img
            let insertBox = document.createElement('div')
            let fileKey = btoa(toBinaryStr(`${fileObj.lastModified}${fileObj.name}${fileObj.size}`))
            insertBox.index = fileKey
            fileMap[fileKey] = fileObj
            insertBox.className = 'wrap-content-img'
            insertBox.innerHTML = `
               <img src="${objectURL}"
                    alt="">
                <div class="mask">
                    <div class="mask-operate">
                        <span class="iconfont icon-fangdajing"></span>
                        <span class="iconfont icon-iconfontzhizuobiaozhun023146"></span>
                        <span class="iconfont icon-shanchu"></span>
                    </div>
                </div>
            `;

            // 3.鼠标放到插入的图片上，显示遮罩层，点击遮罩层上对应的图标按钮后执行对应的操作
            let maskOperate = insertBox.querySelector('.mask .mask-operate')
            maskOperate.addEventListener('click', function (e) {
                if (e.target.classList.contains('icon-fangdajing')) {
                    console.log('放大镜效果');
                    if (bigPreviewImg && bigPreviewsmallImg) {
                        bigPreviewImg.style.display = 'block';
                        bigPreviewsmallImg.src = objectURL || '';  // 确保 objectURL 存在
                    } else {
                        console.error('无法找到 bigPreviewImg 或 bigPreviewsmallImg 元素');
                    }
                } else if (e.target.classList.contains('icon-iconfontzhizuobiaozhun023146')) {
                    console.log('下载效果');
                    // 文件是一种特殊类型的 Bolb
                    var elementA = document.createElement('a')
                    elementA.href = objectURL
                    elementA.download = fileObj.name
                    elementA.click()
                } else if (e.target.classList.contains('icon-shanchu')) {
                    console.log('删除效果');
                    // 删除图片盒子数据
                    delete (fileMap[insertBox.index])
                    // 删除盒子
                    delImgAndParentBox(insertBox)
                }
            })
            let img = insertBox.querySelector('img')
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            };
            wrapContent.insertBefore(insertBox, wrapContent.firstChild)
            console.log(fileMap);
        }).catch(function (err) {
            console.log(err);
        })
    })

    function delImgAndParentBox(el) {
        el.remove()
    }
    function toBinaryStr(str) {
        const coder = new TextEncoder();
        // 1：将 UTF-16 字符串拆分为字节数组
        const charCodes = coder.encode(str);
        // 2 ：连接字节数据以创建二进制字符串
        return String.fromCharCode(...charCodes);
    }

})(window)