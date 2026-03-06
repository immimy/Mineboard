import { Locator } from 'vitest/browser';

export const logElement = (locator: Locator) => {
  console.log(locator.element().outerHTML);
};
