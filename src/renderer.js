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
  console.log(blogsUpload)
  if(null == blogsUpload._mdFile || null == blogsUpload._imgs){
    alert('请选择Markdown文件以及图片文件')
  }else{
    blogsUpload.parseAndUpload()
  }
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
    alert('请先选择Markdown文件')
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
      alert('仅支持上传 [.png .jpg .jpeg .gif] 格式图片')
    }
  }
  blogsUpload.setImgs(fileArray)
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
      blogsUpload.setMdFilePath(filePath)
    } else {
      showMessage("仅支持Markdown格式文件 [文件后缀.md]");
    }
  }
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
