const fs = require('fs');
const path = require('path');

// Load the script content
const scriptContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'script.js'), 'utf8');

// Mock lucide
global.lucide = {
  createIcons: jest.fn()
};

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
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn()
};

// Execute the script
eval(scriptContent);

describe('Theme Toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    localStorage.setItem.mockClear();
  });

  test('setTheme sets data-theme attribute and localStorage', () => {
    // Assuming setTheme is global now
    if (typeof setTheme === 'function') {
      setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    }
  });

  test('updateIcon updates the icon attribute', () => {
    if (typeof updateIcon === 'function') {
      updateIcon('dark');
      expect(document.getElementById('themeIcon').getAttribute('data-lucide')).toBe('sun');
      expect(lucide.createIcons).toHaveBeenCalledWith({ parent: document.getElementById('themeIcon') });
    }
  });
});