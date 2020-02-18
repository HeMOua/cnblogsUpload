window.$ = window.jQuery = require('jquery')
const path = require('path');
const fs = require('fs')
const UploadFile = require('electron').remote


class MDFileUtil{

    static _mimeMapping = {".png": 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'}

    _reg = /(!\[.*?\]\((.*?)\))/g

    constructor(filepath){
        this._fullPath = filepath
        this._dirPath = path.dirname(this._fullPath)
        this._fileName = path.basename(this._fullPath)
        this._content = fs.readFileSync(this._fullPath).toString()
        this._imgPath = []
        this._imgFullPath = []
    }



    //解析文件
    parseFile(){
        this._matchArray = this._content.match(this._reg)
        for(var i = 0, len = this._matchArray.length; i < len; i++){
            let imgRelativePath = this.subBetween(this._matchArray[i], '(', ')')
            this._imgPath.push(imgRelativePath)
            this._imgFullPath.push(path.join(this._dirPath,imgRelativePath))
        }
    }

    // 两字符串之间的字符串
    subBetween(str, a, b){
        let indexa = str.indexOf(a)
        let indexb = str.indexOf(b)
        return str.substring(indexa+1, indexb)
    }

    static getMime(suffix){        
        return this._mimeMapping[suffix] 
    }

    //封装文件对象
    // static packFile(filePath){
    //     // let fileType = this.getMime(path.extname(filePath))
    //     let readStream = fs.createReadStream(filePath)
    //     let fileData = new Array()
    //     readStream.on('open', () => {
    //         console.log('start pack...')
    //         fileData = new Array()
    //     })
    //     readStream.on('data', data =>{
    //         // let blob =  new Blob([data], {type: fileType})
    //         console.log('accept data...')
    //         fileData.push(data)
    //     })
    //     readStream.on('end', () => {
    //         console.log('pack finish...')
    //         this.ajaxUpload(fileData, filePath)
    //     })
    //     readStream.on('error', function(err){
    //         // 读取过程中出错了，清空数据
    //         console.log('pack fail...')
    //         fileData.splice(0, fileData.length);
    //     })
    // }

    static packFile(filePath){
        let data = fs.readFileSync(filePath)
        this.ajaxUpload(data, filePath)
    }

    static ajaxUpload(file, filePath){
        let fileType = this.getMime(path.extname(filePath))
    
        let formdata = new FormData();
        formdata.append('enctype', 'multipart/form-data')
        formdata.append('Filedata', file);
        console.log('upload...')
        $.ajax({
            method: 'post',
            data: formdata,
            dataType: 'json',
            headers:{"x-mime-type":fileType},
            url: 'https://upload.cnblogs.com/imageuploader/processupload?host=www.cnblogs.com',
            processData : false, // 使数据不做处理
            // contentType: 'application/octet-stream',
            contentType: false,
            success: function(resp){
                console.log('success:', resp)
                if(!resp['success']){
                    alert(resp['message'])
                }
            },
            error: function(msg){
                console.log('error:',msg)
            }
        })
    }
}

module.exports = MDFileUtil