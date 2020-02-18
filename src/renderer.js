const electron = require("electron").remote;
const { dialog, session, BrowserWindow } = electron;
const BlogsUtil = require('../src/utils/BlogsUtil');
const MDFileUtil = require('../src/utils/MDFileUtil');
window.$ = window.jQuery = require('jquery')

let isLogin = new Boolean(false)
let filePath
let file

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
  e.preventDefault();
  // handleFile()
  MDFileUtil.ajaxUpload(file, filePath)
});

//拖拽选择文件
$('.dragArea')[0].addEventListener("drop", e => {
  e.preventDefault();
  e.stopPropagation();
  const files = e.dataTransfer.files;

});

//解决拖放文件失效
$('div.dragArea').on("dragover", e => {
  e.preventDefault();
  e.stopPropagation();
});

//超链接选择文件
$('a.selectLink').on("click", () => {
  selectFiles();
});

/////////////其他相关函数/////////////////

//处理拖放的文件
function handleDragFile(files){
  if (files.length > 1) {
    showMessage("仅允许拖动一个文件");
  } else {
    file = files[0]
    filePath = files[0].path;
    if (!filePath.endWith(".md")) {
      showMessage("仅支持Markdown格式文件 [文件后缀.md]");
    } else {
      handleFile()
    }
  }
}

//处理文件
function handleFile() { 
  let MDFile = new MDFileUtil(filePath)
  MDFile.parseFile()
  console.log(MDFile)
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
function selectFiles() {
  return dialog.showOpenDialogSync({
    title: "打开文件",
    properties: ["openFile"],
    filters: [{ name: "Markdown文件", extensions: ["md"] }]
  });
}
