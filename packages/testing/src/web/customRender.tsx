import type React from 'react'

import { render, renderHook } from '@testing-library/react'
import type {
  RenderResult,
  RenderOptions,
  RenderHookOptions,
  RenderHookResult,
} from '@testing-library/react'

export type CustomRenderHookOptions<Props> = RenderHookOptions<Props>

export const customRender = (
  ui: React.ReactElement,
  options: RenderOptions = {}
): RenderResult => {
  return render(ui, {
    ...options,
  })
}

export const customRenderHook = <Props, Result>(
  render: (props: Props) => Result,
  options?: CustomRenderHookOptions<Props>
): RenderHookResult<Result, Props> => {
  return renderHook(render, {
    ...options,
  })
}
