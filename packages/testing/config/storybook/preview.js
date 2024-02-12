// const React = require('react')

// The StorybookProvider is responsible for importing all the mock files,
// booting up the mock server workers, and mocking the router.
const {
  // StorybookProvider,
  MockingLoader,
} = require('@redwoodjs/testing/dist/web/StorybookProvider')

// The base config provides Redwood-specific integrations. User config values
// will be merged into this.
const baseConfig = {
  // decorators: [
  //   (storyFn, { id }) =>
  //     React.createElement(StorybookProvider, { storyFn, id }),
  // ],
  loaders: [MockingLoader],
}

module.exports = baseConfig
