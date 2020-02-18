window.$ = window.jQuery = require('jquery')
const path = require('path');
const fs = require('fs')


class MDFileUtil{

    _reg = /(!\[.*?\]\((.*?)\))/g

    constructor(filepath){
        this._fullPath = filepath
        this._dirPath = path.dirname(this._fullPath)
        this._fileName = path.basename(this._fullPath)
        this._content = fs.readFileSync(this._fullPath).toString()
        this._imgPathMap =  new Map()
        this._imgPath = []
        this._imgFullPath = []
        this.parseFile()
    }

    //解析文件
    parseFile(){
        this._matchArray = this._content.match(this._reg)
        for(var i = 0, len = this._matchArray.length; i < len; i++){
            let imgRelativePath = this.subBetween(this._matchArray[i], '(', ')')
            this._imgPath.push(imgRelativePath)
            this._imgFullPath.push(path.join(this._dirPath,imgRelativePath))
            this._imgPathMap.set(path.basename(imgRelativePath), this._matchArray[i])
        }
    }

    // 两字符之间的字符串
    subBetween(str, a, b){
        let indexa = str.indexOf(a)
        let indexb = str.indexOf(b)
        return str.substring(indexa+1, indexb)
    }
}

module.exports = MDFileUtil