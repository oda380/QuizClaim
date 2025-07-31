'use client';
import * as React from 'react';
import { Hydrate } from './hydrate.js';

export const WagmiContext = React.createContext(undefined);

export function WagmiProvider(parameters) {
  const { children, config } = parameters;
  const props = { value: config };
  return React.createElement(
    Hydrate,
    parameters,
    React.createElement(WagmiContext.Provider, props, children)
  );
}
//# sourceMappingURL=context.js.map