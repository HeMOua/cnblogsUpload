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
    
    uploadImg(){
        for(let i = 0, len = this._imgs.length; i < len; i++){
            this.ajaxUpload(this._imgs[i])
            // this.testAjaxUpload(this._imgs[i])
        }
    }

    replaceURL(){
        for(let search of this._respURLMap.keys()){
            let regStr = this._mdFile._imgPathMap.get(search)
            let reg = new RegExp(this.dealEscape(regStr), 'g')
            let replace = '!['+ this.fileNameNoSuffix(search) +'](' + this._respURLMap.get(search) + ')'
            console.log(reg, replace)
            this._mdFile._content = this._mdFile._content.replace(reg, replace)
        }
    }

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
            alert('尚无可上传的图片')
        }else{
            this.uploadImg()
            this.replaceURL()
            this.writeFile()
            console.log('解析完毕...')
        }
    }

    testAjaxUpload(file){
        let fileName = path.basename(file.path)
        let respURL = this.randomString(10) + '.png'
        this._respURLMap.set(fileName, respURL)
    }

    //通过文件地址上传文件
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
     * 
     * @param {string} fileName 
     */
    fileNameNoSuffix(fileName){
        let sufLen = path.extname(fileName).length
        return fileName.substring(0, fileName.length - sufLen)
    }

    dealEscape(str){
        str = str.replace('[', '\\[')
        str = str.replace(']', '\\]')
        str = str.replace('(', '\\(')
        return str.replace(')', '\\)')
    }

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

module.exports = BlogsUpload