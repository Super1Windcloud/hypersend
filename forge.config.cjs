const path = require('path')
const icon = path.resolve(__dirname, 'build/icon.ico')

const config = {
  packagerConfig: {
    asar: false,
    appVersion: '7.7.7',
    executableName: 'HyperSend',
    prune: true,
    name: 'HyperSend',
    icon: icon,
    ignore: [
      '/!node_modules',
      '/.git',
      '/.vscode',
      '/test_ws',
      '/!esearch',
      '/!public',
      '/forge_out_dist',
      '/src',
      '/.env',
      '/.env.yarn',
      '/resources',
      '/outputLog',
      '/img',
      '!electron_vite_out/',
      '/out', // electron_forge 如果不加/会匹配所有包含out的目录,一定要手动显示指定不排除的构建目录
      '/build',
      '/dist',
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/
    ]
  },
  outDir: 'forge_out_dist',
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
      platforms: ['win32']
    }
  ],
  makers: [
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
        icon: icon,
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
      platforms: ['win32']
    }
  ]
}

module.exports = config
