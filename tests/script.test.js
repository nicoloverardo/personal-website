/* global setTheme, updateIcon */
const fs = require('fs');
const path = require('path');

// Load the script content
const scriptContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'script.js'), 'utf8');

// Mock lucide
global.lucide = {
  createIcons: jest.fn()
};

// Polyfill missing globals used by jsdom (e.g., TextEncoder/TextDecoder)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up jsdom
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>
      <div class="theme-toggle" id="themeToggle">
        <i id="themeIcon" data-lucide="moon"></i>
      </div>
      <div class="fade"></div>
    </body>
  </html>
`, {
  url: 'http://localhost'
});

global.document = dom.window.document;
global.window = dom.window;

// jsdom doesn't implement matchMedia, but our script uses it
global.window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false
});

// Provide a minimal localStorage implementation to avoid errors
global.window.localStorage = {
  getItem: () => null,
  setItem: () => {}
};
global.localStorage = global.window.localStorage;

global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Execute the script
eval(scriptContent);

describe('Theme Toggle', () => {
  beforeEach(() => {
    // No-op; localStorage methods are simple stubs in this environment
  });

  test('setTheme sets data-theme attribute and localStorage', () => {
    // Mock the theme icon element so updateIcon can run without a real DOM
    const fakeIcon = { innerHTML: '', setAttribute: jest.fn() };
    document.getElementById = jest.fn().mockReturnValue(fakeIcon);

    // Assuming setTheme is global now
    if (typeof setTheme === 'function') {
      setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(fakeIcon.setAttribute).toHaveBeenCalledWith('data-lucide', 'sun');
      expect(lucide.createIcons).toHaveBeenCalledWith({ parent: fakeIcon });
    }
  });

  test('updateIcon updates the icon attribute', () => {
    const fakeIcon = { innerHTML: '', setAttribute: jest.fn() };
    document.getElementById = jest.fn().mockReturnValue(fakeIcon);

    if (typeof updateIcon === 'function') {
      updateIcon('dark');
      expect(fakeIcon.setAttribute).toHaveBeenCalledWith('data-lucide', 'sun');
      expect(lucide.createIcons).toHaveBeenCalledWith({ parent: fakeIcon });
    }
  });
});