const path = require('path')
const { ipcRenderer } = require('electron')

/**
 * 获取 Cookie
 */
function getCookie(local) {
  return local ? localStorage.getItem('localCookie') : ipcRenderer.sendSync('getCookie')
}

/**
 * 设置本地 Cookie
 * @param {str} cookie 
 */
function setLocalCookie(cookie) {
  localStorage.setItem('localCookie', cookie)
}

/**
 * 刷新 Cookie 的 UI 显示
 * @param {str} cookie 
 */
function refreshCookieUI(cookie = localStorage.getItem('localCookie')) {
  document.querySelector('#cookieInput').value = cookie
}

/**
 * 两字符之间的字符串
 */
function subStrBetween(str, a, b){
  let indexa = str.indexOf(a)
  let indexb = str.indexOf(b)
  return str.substring(indexa+1, indexb)
}

/**
 * 获取无后缀的文件名
 * @param {string} fileName 
 */
function fileNameNoSuffix(fileName){
  let sufLen = path.extname(fileName).length
  return fileName.substring(0, fileName.length - sufLen)
}

/**
* 处理转义字符
* @param {string} str 
*/
function handleEscape(str){
  str = str.replace('[', '\\[')
  str = str.replace(']', '\\]')
  str = str.replace('(', '\\(')
  return str.replace(')', '\\)')
}

/**
* 获取随机字符串
* @param {*} len 
*/
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    
  var maxPos = $chars.length;
  var pwd = '';
  for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

module.exports = {
  getCookie,
  setLocalCookie,
  refreshCookieUI,
  subStrBetween,
  fileNameNoSuffix,
  handleEscape,
  randomString
}
