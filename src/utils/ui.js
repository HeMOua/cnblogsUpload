module.exports = {
  updateMdImage(isDefault=true, text='') {
    if (isDefault) {
      document.querySelector('#leftTipDefault').style.display = 'block'
      document.querySelector('#leftTip').style.display = 'none'
      document.getElementById('mdFile').setAttribute('src', 'img/file-upload.png')
    } else {
      document.querySelector('#leftTipDefault').style.display = 'none'
      document.querySelector('#leftTip').style.display = 'block'
      document.querySelector('#leftTip').innerHTML = text
      document.getElementById('mdFile').setAttribute('src', 'img/md.png')
    }
  },
  updateImage(imageList) {
    const elem = document.querySelector('#rightArea')
    const imageElem = []
    for (const image of imageList) {
      imageElem.push(`<img src="${image}" draggable="false">`)
    }
    elem.style.flexDirection = 'row'
    elem.innerHTML = imageElem.join('\r\n')
  },
  setBarWidth(id, rate) {
    const parent = document.getElementById(id)
    parent.querySelector('.percent').innerHTML = `${Math.floor(rate*1000)/10}%`
    parent.querySelector('.filled').style.width = `${Math.floor(rate*1000)/10}%`
  },
  setUploadBar(rate) {
    this.setBarWidth('imgUploadProcess', rate)
  },
  setReplaceBar(rate) {
    this.setBarWidth('urlUpdateProcess', rate)
  },
  setBarTitle(text = '', append = false) {
    if (append) {
      text = document.getElementById('processMsg').innerHTML + ', ' + text
    }
    document.getElementById('processMsg').innerHTML = text
  }
}