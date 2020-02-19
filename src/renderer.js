window.$ = window.jQuery = require('jquery')
const electron = require("electron").remote;
const { dialog, session, BrowserWindow } = electron;
const BlogsUpload = require('../src/utils/BlogsUpload');
const path = require('path');

let blogsUpload = new BlogsUpload()

////////////////HTML元素事件监听////////////////

// 登录
$('#login').on('click', ()=>{
  const childWindow = new BrowserWindow({
    width: 800,
    height: 600
  })
  childWindow.loadURL('https://account.cnblogs.com/signin')
})

// 解析上传
$('#parseUpload').on("click", e => {
  if(null == blogsUpload._mdFile || null == blogsUpload._imgs){
    showMessage('请选择Markdown文件以及图片文件')
  }else{
    session.defaultSession.cookies.get({url: 'https://www.cnblogs.com/'}, (e, cookie)=>{
      let flag = false
      for(let i = 0, len = cookie.length ;i < len; i++){
        if((cookie[i].name == '.Cnblogs.AspNetCore.Cookies' || cookie[i].name == '.CNBlogsCookie') && cookie[i].session){
          flag = true
          blogsUpload.parseAndUpload()
          break
        }
      }
      if(!flag){
        showMessage('您尚未登录！')
      }
    })    
  }
  console.log(blogsUpload)
});

//拖拽选择文件
$('.dragArea')[0].addEventListener("drop", e => {
  e.preventDefault();
  e.stopPropagation();
  const files = e.dataTransfer.files;
  handleDragFile(files)
});
$('.dragArea')[1].addEventListener("drop", e => {
  e.preventDefault();
  e.stopPropagation();
  if(null == blogsUpload._mdFile){
    showMessage('请先选择Markdown文件')
    return
  }
  const files = e.dataTransfer.files;
  let fileArray = []
  let allow = BlogsUpload.allowUpload
  for(let i = 0; i < files.length; i++){
    let suffix = path.extname(files[i].path.toString())
    if(allow.indexOf(suffix) != -1){
      fileArray.push(files[i])
    }else{
      showMessage('仅支持上传 [.png .jpg .jpeg .gif] 格式图片')
    }
  }
  blogsUpload.setImgs(fileArray)
  $('#processMsg').html('总共 ' + blogsUpload._imgs.length + ' 张可上传图片')
  alertImg(blogsUpload._imgs)
  console.log(blogsUpload)
});

//解决拖放文件失效
$('div.dragArea').on("dragover", e => {
  e.preventDefault();
  e.stopPropagation();
});

//超链接选择文件
$('a.selectLink').on("click", () => {
  let paths = selectFile()
  if(null != paths){
    blogsUpload.setMdFilePath(paths[0])    
    alterMDImg(filePath)
  }
});

/////////////其他相关函数/////////////////

//处理拖放的文件
function handleDragFile(files){
  if (files.length > 1) {
    showMessage("仅允许拖动一个文件");
  } else {
    let filePath = files[0].path;
    if (path.extname(filePath) === '.md') {
      blogsUpload = new BlogsUpload()
      processerData('#urlUpdateProcess', 0)
      processerData('#imgUploadProcess', 0)
      document.getElementById('processMsg').innerHTML = ''
      blogsUpload.setMdFilePath(filePath)
      alterMDImg(filePath)
    } else {
      showMessage("仅支持Markdown格式文件 [文件后缀.md]");
    }
  }
}

//更改md文件区域图片
function alterMDImg(filePath){
  $('#mdFile').attr('src', 'img/md.png')
  $('#mdFile+div.text').html('<div style="margin-top: 10px;">'+path.basename(filePath) + '</div>')
}

//更改图片区域图片
/**
 * 
 * @param {File[]} imgs 
 */
function alertImg(imgs){
  let obj = $('div.dragArea+.dragArea')
  obj.html('')
  obj.css('flex-direction', 'row')
  for(let i = 0; i < imgs.length; i++){
    obj.append('<img src="'+ imgs[i].path +'"  draggable="false" style="border:1px solid red">')
  }  
}

function processerData(obj, num){
  $(obj).find('.filled').animate({
    width: num + '%'
  }, 100, 'linear', ()=>{
    $(obj).find('.percent').text(num + '%')
  })
}

//////////////公共函数/////////////////

//消息
function showMessage(msg) {
  dialog.showMessageBox({
    type: "info",
    title: "提示信息",
    message: msg
  });
}

//选择文件
function selectFile() {
  return dialog.showOpenDialogSync({
    title: "打开文件",
    properties: ["openFile"],
    filters: [{ name: "Markdown文件", extensions: ["md"] }]
  });
}
