const fs = require('fs')
const path = require('path')

const {
  getConfig,
  getPaths,
  importStatementPath,
} = require('@redwoodjs/project-config')

const redwoodProjectConfig = getConfig()
const redwoodProjectPaths = getPaths()

/** @type { import('@storybook/react-vite').StorybookConfig } */
const baseConfig = {
  framework: {
    name: '@storybook/react-vite',
    // This empty object is actually necessary.
    options: {},
  },

  stories: [
    `${importStatementPath(
      redwoodProjectPaths.web.src
    )}/**/*.stories.@(js|jsx|ts|tsx|mdx)`,
  ],

  // See https://storybook.js.org/docs/react/configure/storybook-addons.
  addons: [
    '@storybook/addon-essentials',
    redwoodProjectConfig.web.a11y && '@storybook/addon-a11y',
  ].filter(Boolean),

  // Only set staticDirs when running Storybook process; will fail if set for SB --build
  ...(process.env.NODE_ENV !== 'production' && {
    staticDirs: [path.join(redwoodProjectPaths.web.base, 'public')],
  }),

  docs: {
    autodocs: 'tag',
  },

  viteFinal: async (sbConfig) => {
    /*
    Determine the default storybook style file to use.
    */
    const supportedStyleIndexFiles = ['index.scss', 'index.sass', 'index.css']
    let defaultStorybookStyleFile = false
    for (const file of supportedStyleIndexFiles) {
      const filePath = path.join(redwoodProjectPaths.web.src, file)
      if (fs.existsSync(filePath)) {
        defaultStorybookStyleFile = filePath
        break
      }
    }

    const newSbConfig = {
      ...sbConfig,
      resolve: {
        ...sbConfig.resolve,
        alias: {
          ...sbConfig.resolve?.alias,
          /* We replace imports to "@redwoodjs/router" with our own implementation in "@redwoodjs/testing" */
          '@redwoodjs/router$': require.resolve(
            '@redwoodjs/testing/dist/web/MockRouter.js'
          ),
          /* This allows us to mock `createAuthentication` which is used by auth
          clients, which in turn lets us mock `useAuth` in tests */
          '@redwoodjs/auth$': require.resolve(
            '@redwoodjs/testing/dist/web/mockAuth.js'
          ),
          '~__REDWOOD__USER_ROUTES_FOR_MOCK': redwoodProjectPaths.web.routes,
          '~__REDWOOD__USER_WEB_SRC': redwoodProjectPaths.web.src,
          ...(defaultStorybookStyleFile
            ? { '~__REDWOOD__USER_WEB_DEFAULT_CSS': defaultStorybookStyleFile }
            : {}),
        },
      },
    }

    /* TODO figure out what to do with the below */
    // let userPreviewPath = './preview.example.js'

    // if (redwoodProjectPaths.storybookPreviewConfig) {
    //   userPreviewPath = redwoodProjectPaths.storybookPreviewConfig
    // }

    // sbConfig.resolve.alias['~__REDWOOD__USER_STORYBOOK_PREVIEW_CONFIG'] =
    //   userPreviewPath

    // sbConfig.resolve.extensions = rwConfig.resolve.extensions
    // sbConfig.resolve.plugins = rwConfig.resolve.plugins // Directory Named Plugin

    return newSbConfig
  },
}

module.exports = baseConfig
