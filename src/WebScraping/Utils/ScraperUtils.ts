/**
 * Here we export all the various information browser utilities we will use for the various scrapers.
 * Consits of Creating a browser instance and scrapeMultipleURLs for concurrent scraping.
 */
import { logger } from "@logger";
import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * Used for storing information about products.
 * Currently these fields can either be strings or null.
 * We can change the types later on when we start designing the DB part.
 */
export interface ProductInfo {
    name: string | null;
    image: string | null;
    price: string | null;
    url: string | null;
}

/**
 * Creating a browser instance.
 * @param runHeadless Set headless for puppeteer. Set to false if you want to see a browser window and scraping actions.
 * @returns {Promise<Browser>} browser instance that the webscraper can utilize.
 */
export const createBrowserInstance = async (
    runHeadless: boolean
): Promise<Browser> => {
    // Tell the puppeteer object to use the Stealth plugin to avoid sites decting that we are scraping them.
    puppeteer.use(StealthPlugin());
    // Create a browser instance
    const browser = await puppeteer.launch({ headless: runHeadless });
    // Return the browser instance we created.
    return browser;
};

/**
 * Each site must have it's own specialized scrape site function.
 * To promote testability and good code practices we need to create an interface
 * for the scrapesite function. This allows us to pass each scrapers scapesite function
 * to our scrape multiple urls function
 * @returns scraped information from products or null if it fails to scrape anything.
 */
interface ScrapeSite {
    (
        url: string,
        browser: Browser,
        scrapeRecursively: boolean
    ): Promise<ProductInfo[] | null>;
}

/**
 * The below function is responsible for scraping multiple sites at a time.
 * The Fred Meyer scraper function can either scrape one page or run concurrent scrape jobs.
 * @param urls array of urls that we want to scrape.
 * @param scrapeRecursively sets if we are going to scrape all possible pages.
 * @param scrapeSite each site has it's own scrape site function that must be passed to the scrapeMultipleURLs function.
 * @returns The scraped product results from the promises.
 */
export const scrapeMultipleURLs = async (
    urls: string[],
    scrapeRecursively: boolean,
    scrapeSite: ScrapeSite
) => {
    // Map all of the URLS to an array of promises
    const scrapePromises = urls.map(async (url) => {
        try {
            // Creates a browser instance before we scrape the site.
            // This allows us to run concurrent scrape jobs, where each instance scrapes the URL.
            // Parameter sets headless, set this to false if you want to see the chrome window open and run the scraping job,
            // set this to true if you don't want the chrome window to open.
            const browserInstance = await createBrowserInstance(false);
            // Run scrape site with the current URL and store the scraped products
            const scrapedProducts = await scrapeSite(
                url,
                browserInstance,
                scrapeRecursively
            );
            // Close the browser instance once finished.
            await browserInstance.close();
            // Return the scraped products
            return scrapedProducts;
        } catch (error) {
            logger.error(`Error scraping ${url}:`, error);
            return null;
        }
    });
    return Promise.all(scrapePromises);
};
