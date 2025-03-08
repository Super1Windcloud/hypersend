import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {}

if (process.contextIsolated) {
  try {
    console.log('Exposing APIs in context isolated mode...')
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    console.log('APIs exposed successfully.')
  } catch (error) {
    console.error('Error exposing APIs:', error)
  }
} else {
  console.log('Exposing APIs in non - context isolated mode...')
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  console.log('APIs exposed successfully.')
}
