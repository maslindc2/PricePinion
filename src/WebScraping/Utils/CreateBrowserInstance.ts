import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

class BrowserInstance {
    /**
     * Creating a browser instance.
     * @param runHeadless Set headless for puppeteer. Set to false if you want to see a browser window and scraping actions.
     * @returns {Promise<Browser>} browser instance that the webscraper can utilize.
     */
    public async createBrowserInstance(runHeadless: boolean): Promise<Browser> {
        // Tell the puppeteer object to use the Stealth plugin to avoid sites decting that we are scraping them.
        puppeteer.use(StealthPlugin());
        // Create a browser instance
        const browser = await puppeteer.launch({ headless: runHeadless });
        // Return the browser instance we created.
        return browser;
    }
}
export { BrowserInstance };
