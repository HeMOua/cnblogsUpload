const fs = require('fs')
const path = require('path')
const { subStrBetween, handleEscape, fileNameNoSuffix } = require('../utils')


module.exports = class MarkdownFile {

  _reg = /(!\[.*?\]\((.*?)\))/g

  constructor(filepath) {
    this._fullPath = filepath
    this._dirPath = path.dirname(this._fullPath)
    this._fileName = path.basename(this._fullPath)
    this._content = fs.readFileSync(this._fullPath).toString()
    this._imgPathMap = new Map()
    this._imgPath = []
    this._imgFullPath = []
    this.parseFile()
  }

  /**
   * 解析文件
   */
  parseFile() {
    this._matchArray = this._content.match(this._reg)
    for (var i = 0, len = this._matchArray.length; i < len; i++) {
      let imgRelativePath = subStrBetween(this._matchArray[i], '(', ')')
      if (imgRelativePath.indexOf('http') == 0) continue
      this._imgPath.push(imgRelativePath)
      this._imgFullPath.push(path.join(this._dirPath, imgRelativePath))
      this._imgPathMap.set(path.basename(imgRelativePath), this._matchArray[i])
    }
  }

  /**
   * 替换 URL
   * @param {str} search 待替换字符串
   */
  replaceUrl(search, content) {
    console.log(search, content)
    const regStr = this._imgPathMap.get(search)
    const reg = new RegExp(handleEscape(regStr), 'g')
    const replace = `![${fileNameNoSuffix(search)}](${content})`
    this._content = this._content.replace(reg, replace)
  }


  /**
   * 写出文件
   */
  writeFile() {
    const fileName = path.join(this._dirPath, fileNameNoSuffix(this._fileName) + '(finish)' + path.extname(this._fileName))
    fs.writeFileSync(fileName, this._content, e => {
      console.log(e)
    })
  }

  get imgFullPath() {
    return this._imgFullPath
  }
}