(function (window) {
    let wrapContent = document.querySelector('.wrap-content')
    let wrapContentAdd = document.querySelector('.wrap-content-add')
    // 事件委托
    /**
     * 1.点击`+`号方框可以打开文件资源管理器选择文件。
     * 2.选择好文件资源管理器中的`image`类型的文件可以将它插入到页面中（注意插入的时候实在第一个之前插入）。然后`+`号方框往后移动
    */
    wrapContentAdd.addEventListener('click', function (e) {
        console.log(wrapContentAdd);
        let p = showOpenFilePicker()
        p.then(function (res) {
            console.log(res[0].getFile());
            return res[0].getFile()
        }).then(function (fileObj) {
            // 这里的content返回的就是一个文件 File 对象实例了
            const objectURL = window.URL.createObjectURL(fileObj);
            // 创建一个装img的盒子 wrap-content-img
            let insertBox = document.createElement('div')
            insertBox.className = 'wrap-content-img'
            insertBox.innerHTML = `
                <img src="${objectURL}" alt="">
                <div class="mask">
                    <div class="mask-operate">
                        <span class="delImg">X</span>
                    </div>
                </div>
            `;
            // 3.鼠标放到插入的图片上，显示遮罩层，点击遮罩层右上角的按钮后删除该结构
            insertBox.addEventListener('click', delSelfStructure)
            let img = insertBox.querySelector('img')
            img.onload = () => {
                URL.revokeObjectURL(img.src);
            };
            wrapContent.insertBefore(insertBox, wrapContent.firstChild)
        }).catch(function (err) {
            console.log(err);
        })
    })

    /**
     * @description: 删除结构
     * @param {*} e
     * @return {*}
     */
    function delSelfStructure(e) {
        if (e.target.className === 'delImg') {
            this.remove()
        }
    }


})(window)