const MDFile = require('./MDFileUtil')
const path = require('path')
const fs = require('fs')

class BlogsUpload{

    static allowUpload = ['.png', '.gif', '.jpg', 'jpeg']
    static _mimeMapping = {".png": 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'}

    /**
     * @type{MDFile}
     */
    _mdFile
    _mdFilePath
    _imgs = []
    _respURLMap = new Map()


    setMdFile(mdFile){
        this._mdFile = mdFile
    }

    setMdFilePath(mdFilePath){
        this._mdFilePath = mdFilePath
        this._mdFile = new MDFile(mdFilePath)
    }

    /**
     * 
     * @param {File[]} imgs 
     */
    setImgs(imgs){
        this._imgs = this.preprocessor(imgs)
    }  

    /**
     * 
     * @param {File[]} imgs 
     */
    preprocessor(imgs){
        let images = []
        for(let i = 0, len = imgs.length; i < len; i++){
            if(this._mdFile._imgFullPath.indexOf(imgs[i].path) != -1){
                images.push(imgs[i])
            }
        }
        return images
    }
    

    /**
     * 上传图片
     */
    uploadImg(){
        for(let i = 0, len = this._imgs.length; i < len; i++){
            this.ajaxUpload(this._imgs[i])
            // this.testAjaxUpload(this._imgs[i])
            processerData('#imgUploadProcess', (i+1)/len*100)
        }
    }

    /**
     * 更改本地图片URL
     */
    replaceURL(){
        let size = this._respURLMap.size, i = 0
        for(let search of this._respURLMap.keys()){
            i += 1
            let regStr = this._mdFile._imgPathMap.get(search)
            let reg = new RegExp(this.dealEscape(regStr), 'g')
            let replace = '!['+ this.fileNameNoSuffix(search) +'](' + this._respURLMap.get(search) + ')'
            this._mdFile._content = this._mdFile._content.replace(reg, replace)
            processerData('#urlUpdateProcess', i/size*100)
        }
    }

    /**
     * 写出文件
     */
    writeFile(){
        let md = this._mdFile
        let fileName = path.join(md._dirPath, this.fileNameNoSuffix(md._fileName) + '(finish)' + path.extname(md._fileName))
        console.log(fileName)
        fs.writeFileSync(fileName, this._mdFile._content, e=>{
            console.log(e)
        })
    }

    parseAndUpload(){
        if(null == this._imgs || this._imgs.length == 0){
            showMessage('尚无可上传的图片')
        }else{
            this.uploadImg()
            this.replaceURL()
            this.writeFile()
            console.log('解析完毕...')
        }
    }

    /**
     * 测试上传
     * @param {} file 
     */
    testAjaxUpload(file){
        let fileName = path.basename(file.path)
        let respURL = this.randomString(10) + '.png'
        this._respURLMap.set(fileName, respURL)
    }


    /**
     * 通过文件数据上传文件
     * @param {File} file 
     */
    ajaxUpload(file){
        let respURL   
        let formdata = new FormData();
        let fileName = path.basename(file.path)
        formdata.append('enctype', 'multipart/form-data')
        formdata.append('Filedata', file);
        console.log('upload...')
        $.ajax({
            method: 'post',
            data: formdata,
            dataType: 'json',
            async: false,
            url: 'https://upload.cnblogs.com/imageuploader/processupload?host=www.cnblogs.com',
            processData : false, // 使数据不做处理
            contentType: false,
            success: function(resp){
                console.log('success:', resp)
                if(!resp['success']){
                    alert(resp['message'])
                }else{
                    respURL = resp['message']
                }
            },
            error: function(msg){
                console.log('error:',msg)
                alert(resp['message'])
            }
        })
        this._respURLMap.set(fileName, respURL)
    }    

    //获取媒体文件类型
    static getMime(suffix){        
        return this._mimeMapping[suffix] 
    }

    /**
     * 获取无后缀的文件名
     * @param {string} fileName 
     */
    fileNameNoSuffix(fileName){
        let sufLen = path.extname(fileName).length
        return fileName.substring(0, fileName.length - sufLen)
    }

    /**
     * 处理转义字符
     * @param {string} str 
     */
    dealEscape(str){
        str = str.replace('[', '\\[')
        str = str.replace(']', '\\]')
        str = str.replace('(', '\\(')
        return str.replace(')', '\\)')
    }

    /**
     * 获取随机字符串
     * @param {*} len 
     */
    randomString(len) {
    　　len = len || 32;
    　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (var i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }
}

function showMessage(msg) {
    dialog.showMessageBox({
        type: "info",
        title: "提示信息",
        message: msg
    });
}

function processerData(obj, num){
  $(obj).find('.filled').animate({
    width: num + '%'
  }, 20, 'linear', ()=>{
    $(obj).find('.percent').text(num + '%')
    if(num == 100)
    document.getElementById('processMsg').innerHTML = '成功！'
  })
}

module.exports = BlogsUpload