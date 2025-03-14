module.exports = {
  packagerConfig: {
    ignore: [
      /^\/src/,
      '^dist',
      '.git',
      '^img',
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/
    ],
    name: 'HyperSend',
    icon: 'build/sky3.ico',
    appCategoryType: 'productivity'
  },
  outDir: 'forge_make',
  rebuildConfig: {},
  makers: [
    // {
    //   name: '@electron-forge/maker-squirrel',
    //   config: {
    //     name: 'HyperSend',
    //     authors: 'SuperWindcloud',
    //     setupIcon: 'build/sky3.ico'
    //   }
    // },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32']
    }
  ],
  plugins: []
}
