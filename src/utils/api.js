const fs = require('node:fs')
const https = require('node:https')
const FormData = require('form-data')

/**
 * 校验 Cookie 是否有效
 */
function checkCookieValid(cookie) {
  return new Promise((resolve, reject) => {
    https.get('https://i.cnblogs.com/api/user', { 
      headers: { Cookie: cookie }
    }, resp => {
      resp.on('data', data => {
        data = JSON.parse(new TextDecoder().decode(data))
        const isValid = 'errors' in data ? false : true
        resolve(isValid)
      })
    }).on('error', e => reject(e))
  }) 
}

/**
 * 上传图片
 * @param {*} cookie 
 * @param {*} file 
 * @returns 
 */
function uploadImage(cookie, file) {
  const fileName = path.basename(file.path)
  const formData = new FormData()
  formData.append('Filedata', fs.createReadStream(file.path))

  return new Promise((resolve, reject) => {
    const req = https.request('https://upload.cnblogs.com/imageuploader/processupload', {
      method: 'POST',
      headers: { Cookie: cookie, ...formData.getHeaders() },
    }, resp => {
      resp.on('data', (chunk) => {
        let data = JSON.parse(Buffer.from(chunk).toString())
        data.fileName = fileName
        console.log(data)
        resolve(data)
      })
    })
    req.on('error', (e) => reject(e))
    formData.pipe(req)
  })
}

module.exports = {
  checkCookieValid,
  uploadImage
}
