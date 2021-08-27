/* eslint-disable unicorn/no-null, unicorn/no-useless-undefined */
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';

export const defaultRouter: NextRouter = {
  basePath: '',
  route: '',
  pathname: '',
  query: {},
  asPath: '',
  push: async () => true,
  replace: async () => true,
  reload: () => null,
  back: () => null,
  prefetch: async () => undefined,
  beforePopState: () => null,
  isFallback: false,
  events: {
    on: () => null,
    off: () => null,
    emit: () => null,
  },
  isLocaleDomain: false,
  isPreview: false,
  isReady: true,
  defaultLocale: '',
  domainLocales: undefined,
  locale: '',
  locales: [''],
};

/**
 * Function to create a mounted RouterContext wrapper for a Next.js component
 *
 * @param tree Components tree to be wrapped.
 * @param router Router options which override the defaults.
 * @returns A mounted React component with Router context.
 */
export function withNextTestRouter(
  tree: React.ReactElement,
  router: Partial<NextRouter> = defaultRouter
): JSX.Element {
  return (
    <RouterContext.Provider value={{ ...defaultRouter, ...router }}>{tree}</RouterContext.Provider>
  );
}
