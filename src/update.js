const { ipcMain, session, BrowserWindow } = require('electron')

async function getCookieFromSession() {
  const cookie = await session.defaultSession.cookies.get({ url: 'https://i.cnblogs.com/'})
  const authList = ['.CNBlogsCookie', '.Cnblogs.AspNetCore.Cookies']
  let result = []
  
  for (let item of cookie) {
    if (authList.indexOf(item['name']) != -1) {
      result.push(`${item['name']}=${item['value']}`)
    }
  }
  return result.join('; ')
}

module.exports = () => {
  ipcMain.on('getCookie', async(event, arg) => {
    event.returnValue = await getCookieFromSession()
  })

  ipcMain.on('handleLogin', (event) => {
    const childWindow = new BrowserWindow({
      width: 400,
      height: 660,
      frame: true,
      show: false,
      fullscreenable: false,
      backgroundColor: 'black'
    })
    childWindow.once('ready-to-show', ()=>{
      childWindow.show();
    })
    childWindow.loadURL('https://account.cnblogs.com/signin')
    childWindow.on('closed', () => event.reply('setCookie'))
  })
}
