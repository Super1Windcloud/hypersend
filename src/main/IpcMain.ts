
import { devLog, getLocalIPAddress, getLocalWlanIPAddress } from '@/utils/index'
import {  ipcMain } from 'electron'
import { sendClipboardToClient, sendFileToClient, sendFolderToClient, sendMessageToClient, startClientServer , stopClientServer  } from './client'



export function startListeningRenderer()   {
  ipcMain.handle('getLocalIPAddress', async () =>
  {
    return getLocalIPAddress()
  })
  ipcMain.handle('getLocalWlanIP', async () =>
  {
    return getLocalWlanIPAddress();
  })


  ipcMain.on('sendMessage' ,    (event ,  message) =>
  {
     devLog("ipcmain sendMessage to  client", message    )
     sendMessageToClient(message)
  })

  ipcMain.handle('openFile', async () =>
  {
    devLog("ipcmain openFile to  client  port ")
     sendFileToClient ( ) ;
  })

  ipcMain.handle('openFolder', async () =>
  {
    devLog("ipcmain openFolder to  client  port ")
    sendFolderToClient();
  })

  ipcMain.handle('sendClipboard', async () =>
  {
    devLog("ipcmain sendClipboard to  client  port ")
     sendClipboardToClient ( ) ;

  })
  // 服务端默认监听客户端33333 端口
  ipcMain.on("startServerListener" ,  async ()=>{
    devLog("ipcmain startServerListener  ")
    await   startClientServer()
  })
  ipcMain.on("stopServerListener" ,  ()=>{
    devLog("ipcmain stopServerListener  ");
    stopClientServer();
    }
  )



}
