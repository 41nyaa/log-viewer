import { app, BrowserWindow, dialog, Menu } from 'electron'
import * as path from 'path'
import * as url from 'url'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'

let mainWindow: Electron.BrowserWindow | null

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    title: 'File',
    backgroundColor: '#ffffff',
    webPreferences: {
      nodeIntegration: true
    }
  })

  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Open Log File',
          accelerator: 'CmdOrCtrl+L',
          click () {
            const files = dialog.showOpenDialogSync({
              properties: ['openFile', 'multiSelections']
            })
            if (mainWindow != null && files !== undefined) {
              mainWindow.webContents.send('LOG_FILE_OPEN', files)
            }
          }
        },
        {
          label: 'Open Filter File',
          accelerator: 'CmdOrCtrl+F',
          click () {
            const files = dialog.showOpenDialogSync({
              properties: ['openFile']
            })
            if (mainWindow != null && files !== undefined) {
              mainWindow.webContents.send('FILTER_FILE_OPEN', files)
            }
          }
        },
        {
          label: 'Toggle Dev Tools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow != null) mainWindow.webContents.toggleDevTools()
          }
        },
        {
          label: 'Exit',
          click () {
            app.quit()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:4000')
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true
      })
    )
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
  .whenReady()
  .then(() => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err))
    }
  })
app.allowRendererProcessReuse = true
