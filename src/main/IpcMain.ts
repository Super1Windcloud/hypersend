
import { devLog, getLocalIPAddress, getLocalWlanIPAddress } from '@/utils/index'
import {  ipcMain } from 'electron'
import { sendMessageToClient, startClientServer , stopClientServer  } from './client'



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
  })

  ipcMain.handle('openFolder', async () =>
  {
    devLog("ipcmain openFolder to  client  port ")
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
