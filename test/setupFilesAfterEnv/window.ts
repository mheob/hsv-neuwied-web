/* eslint-disable @typescript-eslint/no-empty-function */
export const noop = () => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

window.matchMedia =
  window.matchMedia ||
  (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  }))
