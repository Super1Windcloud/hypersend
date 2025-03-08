import { app, shell, BrowserWindow, Tray, Menu  } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { exist } from '@/utils/index'
const iconPath= join(__dirname, '../../resources/victory.png')
import { startListeningRenderer } from './IpcMain'
import { startClientServer } from './client'


let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
const preloadPath  =
  (exist(join(__dirname, '../preload/index.cjs')) ??
    exist(join(__dirname, '../preload/index.mjs'))) ??
  exist(join(__dirname, '../preload/index.js'));

console.error('preloadPath', preloadPath)

// handle 异步通信 返回Promise,  on监听同步函数,

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: 'HyperSend',
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    icon: join(__dirname, '../../resources/victory.png'),
    ...(process.platform === 'linux' ? { icon: iconPath } : {}),
    webPreferences: {
      // 推荐使用preload  暴露node API
      contextIsolation: true, // 禁用上下文隔离
      nodeIntegration: false, // 禁用 Node.js 集成
      preload: preloadPath??  join(__dirname, '../preload/index.js') ,
      sandbox: false
    }
  })
  startListeningRenderer()
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })
  if (is.dev) {
    // mainWindow.webContents.openDevTools()
  }
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  // mainWindow.on('minimize', (event) => {
  //   event.preventDefault()
  //   mainWindow?.hide()
  // })

  // 创建系统托盘图标
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      click: () => {
        mainWindow?.show()
      }
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('HyperSend')
  tray.setContextMenu(contextMenu)

  // 监听托盘图标点击事件
  tray.on('click', () => {
   if (mainWindow?.isVisible()) {
     mainWindow.hide()
   } else {
     mainWindow?.show()
   }
  })
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
