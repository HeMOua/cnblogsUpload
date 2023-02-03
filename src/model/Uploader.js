const MarkdownFile = require('./MarkdownFile')
const { uploadImage } = require('../utils/api')
const UiUtils = require('../utils/ui')

module.exports = class Uploader {

  static _mimeMapping = {'.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg'}

  _mdFile
  _imageList = []

  /**
   * 设置图片
   * @param {File[]} imageList 图片列表
   */
  setImageList(imageList) {
    this._imageList = []
    for(let i = 0, len = imageList.length; i < len; i++){
      if(this._mdFile.imgFullPath.indexOf(imageList[i].path) != -1){
        this._imageList.push(imageList[i])
      }
    }
  }

  /**
   * 校验是否可以上传文件
   */
  checkCanUpload() {
    if (this._mdFile == null) throw '请选择 Markdown 文件'
    if (this._imageList.length == 0) throw '没有可以上传的文件'
  }

  /**
   * 上传文件
   * @param {str} cookie 
   */
  async upload(cookie) {
    this.checkCanUpload()
    // 上传
    const respList = []
    for (let i = 0, len = this._imageList.length; i < len ; i++) {
      let resp = await uploadImage(cookie, this._imageList[i]).catch(e => console.log(e))
      UiUtils.setUploadBar((i+1)/len)
      respList.push(resp)
    }
    // 替换本地
    console.log(respList)
    const correctRespList = respList.filter(item => item.success)
    for (let i = 0, len = correctRespList.length; i < len ; i++) {
      this._mdFile.replaceUrl(correctRespList[i].fileName, correctRespList[i].message)
      UiUtils.setReplaceBar((i+1)/len)
    }
    UiUtils.setBarTitle(`成功上传${correctRespList.length}张图片`, true)
    // 写出文件
    if (correctRespList.length == 0) {
      UiUtils.setBarTitle(`无可替换链接`, true)
    } else {
      this._mdFile.writeFile()
    }
    // 导出未上传数据
    return respList.filter(item => !item.success).map(item => `fileName=${item.fileName}, message=${item.message}`).join('\n')
  }

  static allow(suffix) {
    return suffix in Uploader._mimeMapping
  }

  get mdFile() {
    return this._mdFile
  }
  set mdFile(file) {
    this._mdFile = new MarkdownFile(file)
  }

  get imageList() {
    return this._imageList
  }
}