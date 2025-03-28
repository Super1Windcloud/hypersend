import type { ForgeConfig } from '@electron-forge/shared-types';
const path = require('path')
const icon = path.resolve(__dirname, 'build/icon.ico')

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    appVersion: '7.7.7',
    executableName: 'HyperSend',
    prune: true,
    name: 'HyperSend',
    icon:  icon ,
    ignore: ['./.git', 'test_ws', 'src', 'resources', 'outputLog', 'img', 'build', 'dist']
  },
  rebuildConfig: {},
  outDir: 'forge_out_dist',
  makers: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    {
      name: '@electron-forge/maker-wix',
      platforms: ['win32'],
      config: {
        language: 1033,
        features: true,
        manufacturer: 'superwindcloud',
        ui: {
          chooseDirectory: true // 允许用户选择安装目录
        },
        icon: path.join(__dirname, 'build/icon.ico'),
        description: 'HyperSend by Superwindcloud',
        exe: 'HyperSend.exe',
        name: 'HyperSend',
        programFilesFolderName: 'HyperSend',
        shortName: 'HyperSend',
        version: '7.7.7'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
      config: {
        icon: path.join(__dirname, 'assist/icon.ico')
      }
    }
  ]
}



export default config;
