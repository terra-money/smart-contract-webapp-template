import path from 'path';
import runBrowser from 'terra-web-extension';
import url from 'url';

const port = +(process.env.PORT ?? 3000);

const DIRNAME = path.dirname(url.fileURLToPath(import.meta.url));
const EXTENSION_CONFIG = path.resolve(DIRNAME, '../../station.config.json');
const BROWSER_USER_DATA = path.resolve(DIRNAME, '../browser-user-data');

runBrowser(`${process.env.HTTPS ? 'https' : 'http'}://localhost:${port}`, {
  configPath: EXTENSION_CONFIG,
  puppeteerLaunchOptions: {
    userDataDir: BROWSER_USER_DATA,
    headless: false,
    defaultViewport: null,
    devtools: true,
  },
});
