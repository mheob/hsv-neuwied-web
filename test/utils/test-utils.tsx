import '@testing-library/jest-dom';

import {
  RenderOptions,
  RenderResult,
  waitFor as _waitFor,
  fireEvent,
  render as rtlRender,
} from '@testing-library/react';
// TODO: Add back after axe types are synchron to jest-axe
// import type { RunOptions } from 'axe-core';
import { axe, toHaveNoViolations } from 'jest-axe';
import * as React from 'react';

expect.extend(toHaveNoViolations);

type UI = Parameters<typeof rtlRender>[0];

// UI-less passthrough fallback to prevent using conditional logic in render
function ChildrenPassthrough({ children }: { children: React.ReactElement }) {
  return children;
}

export type TestOptions = Omit<RenderOptions, 'wrapper'> & { wrapper?: typeof ChildrenPassthrough };

/**
 * Custom render for @testing-library/react
 *
 * @param component The component under test
 * @param options Customized test options
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
export const render = (
  ui: UI,
  { wrapper: Wrapper = ChildrenPassthrough, ...options }: TestOptions = {}
): RenderResult => rtlRender(<Wrapper>{ui}</Wrapper>, options);

export { rtlRender };
export { axe };

export * from '@testing-library/react';

export {
  act as invoke,
  renderHook,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TS2105
  RenderHookOptions,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TS2105
  RenderHookResult,
} from '@testing-library/react-hooks';

export { default as userEvent } from '@testing-library/user-event';

export const escape = (ui: HTMLElement): boolean =>
  fireEvent.keyDown(ui, { key: 'Escape', keyCode: 27 });

// TODO: Add back after axe types are synchron to jest-axe
// type TestA11YOptions = TestOptions & { axeOptions?: RunOptions };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TestA11YOptions = TestOptions & { axeOptions?: any };

/**
 * Validates against common a11y mistakes.
 *
 * Wrapper for jest-axe
 *
 * @example
 *   it('passes a11y test', async () => {
 *     await testA11Y(<MyComponent />, options);
 *   });
 *
 *   // sometimes we need to perform interactions first to render conditional UI
 *   it('passes a11y test when open', async () => {
 *     const { container } = render(<MyComponent />, options);
 *     fireEvent.click(screen.getByRole('button'));
 *     await testA11Y(container, options);
 *   });
 *
 * @see https://github.com/nickcolley/jest-axe#testing-react-with-react-testing-library
 */
export const testA11y = async (
  ui: UI | Element,
  { axeOptions, ...options }: TestA11YOptions = {}
): Promise<void> => {
  const container = React.isValidElement(ui) ? render(ui, options).container : ui;

  const results = await axe(container, axeOptions);

  expect(results).toHaveNoViolations();
};

// TODO: Readd if needed
// // Overwrite the default timeout of `waitFor` from 1 to 3 seconds
// export function waitFor<T>(callback: () => T | Promise<T>, options?: waitForOptions): Promise<T> {
//   return _waitFor(callback, { ...options, timeout: 3000 });
// }
