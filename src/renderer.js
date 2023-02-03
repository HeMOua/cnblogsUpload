const path = require('path');
const { ipcRenderer } = require('electron')
const { getCookie, setLocalCookie, refreshCookieUI } = require("../src/utils")
const { checkCookieValid } = require('../src/utils/api')
const Uploader = require('../src/model/Uploader')
const UiUtils = require('../src/utils/ui')


let uploader = new Uploader()

ipcRenderer.on('setCookie', () => {
  setLocalCookie(getCookie(false))
  refreshCookieUI()
})

// 登录
document.querySelector('#login').addEventListener('click', ()=>{
  ipcRenderer.send('handleLogin')
})

// 验证登录
document.querySelector('#verifyBtn').addEventListener('click', ()=>{
  checkLogin(() => {
    alert('已登录，可以进行上传解析！')
  })
})

// 解析上传
document.querySelector('#parseUpload').addEventListener("click", () => {
  checkLogin(async () => {
    try {
      const errorStr = await uploader.upload(getCookie(true))
      if (errorStr) {
        alert(`未上传图片信息提示\n${errorStr}\n如果验证时显示了已登录，但提示信息仍显示未登录则需手动粘贴 Cookie\n或者点击‘登录账号’按钮后立即关闭窗口则可自动填充 Cookie！`)
      }
    } catch (e) {
      alert(e)
    }
  })
});

// 更新 Cookie
document.querySelector('#cookieInput').addEventListener('change', () => {
  setLocalCookie(document.querySelector('#cookieInput').value)
})

// 拖拽选择文件
document.querySelectorAll('.dragArea')[0].addEventListener("drop", e => {
  e.preventDefault()
  e.stopPropagation()
  const files = e.dataTransfer.files
  handleDragFile(files)
})

// 拖拽导入图片
document.querySelectorAll('.dragArea')[1].addEventListener("drop", e => {
  e.preventDefault()
  e.stopPropagation()
  // 校验是否选择 MD
  if(null == uploader.mdFile){
    alert('请先选择Markdown文件')
    return
  }
  // 校验过滤可上传文件
  const files = e.dataTransfer.files;
  const fileArray = []
  for(let i = 0; i < files.length; i++){
    const suffix = path.extname(files[i].path.toString())
    if(Uploader.allow(suffix)){
      fileArray.push(files[i])
    }else{
      alert('仅支持上传 [.png .jpg .jpeg .gif] 格式图片')
    }
  }
  // 设置好 uploader 参数
  uploader.setImageList(fileArray)
  // 更新 UI
  UiUtils.setUploadBar(0)
  UiUtils.setReplaceBar(0)
  UiUtils.setBarTitle(`目前总共[${uploader.imageList.length}]张图片可上传`)
  UiUtils.updateImage(fileArray.map(item => item.path))
})

//解决拖放文件失效
document.querySelectorAll('div.dragArea').forEach(item => {
  item.addEventListener("dragover", e => {
    e.preventDefault()
    e.stopPropagation()
  })
})

// 封装校验登录函数
function checkLogin(callback) {
  checkCookieValid(getCookie(true)).then(isValid => {
    if (isValid) {
      if (typeof callback === 'function') callback()
    } else {
      window.alert('尚未登录或者 Cookie 有误，请输入正确的 Cookie 或者进行登录！')
    }
  }).catch(e => {
    window.alert('验证错误')
  })
}


//处理拖放的文件
function handleDragFile(files){
  if (files.length > 1) {
    alert("仅允许拖动一个文件")
  } else {
    const filePath = files[0].path;
    if (path.extname(filePath) === '.md') {
      // 设置左侧与右侧图片信息
      UiUtils.updateMdImage(false, path.basename(filePath))
      if (uploader) {
        UiUtils.updateImage([])
      }
      // 设置 MD 文件路径
      uploader = new Uploader()
      uploader.mdFile = filePath
      // 重置进度条以及进度条提示
      UiUtils.setUploadBar(0)
      UiUtils.setReplaceBar(0)
      UiUtils.setBarTitle()
    } else {
      alert("仅支持Markdown格式文件 [文件后缀.md]");
    }
  }
}
