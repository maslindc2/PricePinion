import { Browser } from "puppeteer";
import puppeteer from "puppeteer";

class BrowserInstance {
    /**
     * Creating a browser instance.
     * @param runHeadless Set headless for puppeteer. Set to false if you want to see a browser window and scraping actions.
     * @returns {Promise<Browser>} browser instance that the webscraper can utilize.
     */
    public async createBrowserInstance(runHeadless: boolean): Promise<Browser> {
        // Create a browser instance
        // Disabling the chrome headless automation controlled flag, so now we are extra sneaky.
        const browser = await puppeteer.launch({ headless: runHeadless, args:[
            '--disable-blink-features=AutomationControlled',
        ] });
        // Return the browser instance we created.
        return browser;
    }
}
export { BrowserInstance };
