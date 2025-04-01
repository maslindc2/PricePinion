import puppeteer, { Browser } from "puppeteer";
import UserAgent from "user-agents";

class BrowserInstance {
    /**
     * Creating a browser instance.
     * @param runHeadless Set headless for puppeteer. Set to false if you want to see a browser window and scraping actions.
     * @returns {Promise<Browser>} browser instance that the webscraper can utilize.
     */
    public async createBrowserInstance(runHeadless: boolean): Promise<Browser> {
        // Generating a random desktop user agent from user-agents package
        const userAgent = new UserAgent({ deviceCategory: "desktop" });

        // Creating a browser instance using runHeadless boolean, hiding automation controlled flag, and setting a random user agent
        const browser = await puppeteer.launch({
            headless: runHeadless,
            args: [
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-infobars",
                "--disable-dev-shm-usage",
                "--ignore-certificate-errors",
                "--ignore-certificate-errors-spki-list",
                "--enable-features=NetworkService,NetworkServiceInProcess",
                `--user-agent=${userAgent.toString()}`, // Setting a random user agent
            ],
        });
        // Return the browser instance we created.
        return browser;
    }
}
export { BrowserInstance };
