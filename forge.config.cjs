const path = require('path')
const icon = path.resolve(__dirname, 'build/icon.ico')

const config = {
  packagerConfig: {
    asar: false ,
    appVersion: '7.7.7',
    executableName: 'HyperSend',
    prune: true,
    name: 'HyperSend',
    icon: icon,
    dir: path.resolve(__dirname, 'dist'),
    ignore: [
      'node_modules/onnxruntime-node/bin/napi-v3/darwin',
      'node_modules/onnxruntime-node/bin/napi-v3/linux',
      '!node_modules/openai',
      '/.git',
      '/.vscode',
      '/test_ws',
      '/!esearch',
      /^\/out/,
      '/!public',
      '/!package.json',
      '/package-lock.json',
      '/yarn.lock',
      '/pnpm-lock.yaml',
      /^\/.env$/,
      '.env.yarn',
      '/resources',
      '/outputLog',
      '/img',
      '/image.png',
      /^\/build/,
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/
    ]
  },
  outDir  : "A:/test_forge",
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      platforms: ['win32'],
      config: {
        language: 1033,
        features: true,
        manufacturer: 'superwindcloud',
        ui: {
          chooseDirectory: true
        },
        icon: icon,
        description: 'HyperSend by Superwindcloud',
        exe: 'HyperSend.exe',
        name: 'HyperSend',
        programFilesFolderName: 'HyperSend',
        shortName: 'HyperSend',
        version: '7.7.7',
        includeLocale: false
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    }
  ]
}

module.exports = config
