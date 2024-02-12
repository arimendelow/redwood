const fs = require('fs')
const path = require('path')

const { mergeConfig } = require('vite')

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

  core: {
    builder: '@storybook/builder-vite',
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

  async viteFinal(sbConfig) {
    // // We replace imports to "@redwoodjs/router" with our own implementation in "@redwoodjs/testing"
    // sbConfig.resolve.alias['@redwoodjs/router'] = require.resolve(
    //   '@redwoodjs/testing/dist/web/MockRouter.js'
    // )
    // // This allows us to mock `createAuthentication` which is used by auth
    // // clients, which in turn lets us mock `useAuth` in tests
    // sbConfig.resolve.alias['@redwoodjs/auth'] = require.resolve(
    //   '@redwoodjs/testing/dist/web/mockAuth.js'
    // )
    // sbConfig.resolve.alias['~__REDWOOD__USER_ROUTES_FOR_MOCK'] =
    //   redwoodProjectPaths.web.routes
    // sbConfig.resolve.alias['~__REDWOOD__USER_WEB_SRC'] =
    //   redwoodProjectPaths.web.src

    // let userPreviewPath = './preview.example.js'

    // if (redwoodProjectPaths.storybookPreviewConfig) {
    //   userPreviewPath = redwoodProjectPaths.storybookPreviewConfig
    // }

    // sbConfig.resolve.alias['~__REDWOOD__USER_STORYBOOK_PREVIEW_CONFIG'] =
    //   userPreviewPath

    return mergeConfig(sbConfig, {
      resolve: {
        alias: {
          '@redwoodjs/router': '@redwoodjs/testing/dist/web/MockRouter.js',
          '@redwoodjs/auth': '@redwoodjs/testing/dist/web/mockAuth.js',
          '~__REDWOOD__USER_ROUTES_FOR_MOCK': redwoodProjectPaths.web.routes,
          '~__REDWOOD__USER_WEB_SRC': redwoodProjectPaths.web.src,
        },
      },
    })
  },
}

module.exports = baseConfig
