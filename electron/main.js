const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
require('dotenv').config()

const { initDB } = require('./services/db')

const isDev = !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'ScalpCraft',
    backgroundColor: '#0f172a',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

ipcMain.handle('ping', () => 'pong')

app.whenReady().then(() => {
  try {
    initDB()
  } catch (err) {
    console.error('[main] Error al inicializar la DB:', err.message)
    console.error('[main] Solución: corré  npm run rebuild-native')
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
