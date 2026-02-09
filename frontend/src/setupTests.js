// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const msg = String(args[0] ?? "");
    if (msg.includes("React Router Future Flag Warning")) return;
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
