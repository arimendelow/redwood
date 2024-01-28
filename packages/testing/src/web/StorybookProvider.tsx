import type { ReactNode, ReactPortal } from 'react'
import * as React from 'react'

import { MockProviders } from './MockProviders'
import { setupRequestHandlers, startMSW, mockCurrentUser } from './mockRequests'

export const MockingLoader = async () => {
  const mockImports = import.meta.glob(
    '/Users/arimendelow/code/rw-test-proj/web/src/**/*.mock.@(js|ts)',
    { eager: true }
  )
  console.log('mockImports', mockImports)

  await startMSW('browsers')
  setupRequestHandlers()

  return {}
}

export const StorybookProvider: React.FunctionComponent<{
  storyFn: () => ReactNode | ReactPortal
  id: string
}> = ({ storyFn }) => {
  // default to a non-existent user at the beginning of each story
  mockCurrentUser(null)

  return <MockProviders>{storyFn()}</MockProviders>
}
