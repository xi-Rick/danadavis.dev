import type { MDXComponents } from 'mdx/types'
import React from 'react'
import ReactDOM from 'react-dom'
import * as _jsx_runtime from 'react/jsx-runtime'

export interface MDXLayoutRenderer {
  code?: string
  components?: MDXComponents
  [key: string]: unknown
}

function getMDXComponent(
  code: string,
  globals: Record<string, unknown> = {},
): React.ComponentType<MDXLayoutRenderer> {
  const scope = { React, ReactDOM, _jsx_runtime, ...globals }
  const fn = new Function(...Object.keys(scope), code)
  const Component = fn(...Object.values(scope)).default
  Component.displayName = 'MDXComponent'
  return Component
}

// TS transpile it to a require which causes ESM error
// Copying the function from contentlayer as a workaround
// Copy of https://github.com/contentlayerdev/contentlayer/blob/main/packages/next-contentlayer/src/hooks/useMDXComponent.ts
export function useMDXComponent(
  code?: string,
  globals: Record<string, unknown> = {},
): React.ComponentType<MDXLayoutRenderer> {
  return React.useMemo(() => {
    if (!code) {
      const EmptyComponent = () => <></>
      EmptyComponent.displayName = 'EmptyMDXComponent'
      return EmptyComponent
    }
    const Component = getMDXComponent(code, globals)
    Component.displayName = 'MDXComponent'
    return Component
  }, [code, globals])
}

export function MDXLayoutRenderer({
  code,
  components,
  ...rest
}: MDXLayoutRenderer) {
  const Mdx = useMDXComponent(code)
  return <Mdx components={components} {...rest} />
}
