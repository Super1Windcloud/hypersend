module.exports = {
  packagerConfig: {
    ignore: [
      /^\/src/,
      /(.eslintrc.json)|(.gitignore)|(electron.vite.config.ts)|(forge.config.cjs)|(tsconfig.*)/
    ],
    asar: true,
    name: 'HyperSend',
    icon: 'build/sky3.ico'
  },
  outDir: 'forge-make',
  buildIdentifier: 'prod',

  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'superwindcloud',
          name: 'HyperSend'
        },
        draft: false,
        prerelease: false,
        generateReleaseNotes: true
      }
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'HyperSend',
        authors: 'SuperWindcloud',
        setupIcon: 'build/sky3.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['windows']
    }
  ]
}
