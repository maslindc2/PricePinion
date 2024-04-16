import { createBrowserInstance } from "@create-browser-instance";
import { logger } from "@logger";
import { Browser } from "puppeteer";

/**
 * This is a function to delay the execution of certain tasks, sometimes a website loads slowly
 * this prevents any problems with skipping products or elements because they haven't loaded.
 * @param ms number of ms to sleep for
 * @returns a resolved promise once the timeout has finished
 */
export const sleepBeforeOperation = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

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
 * Each site must have it's own specialized scrape site function.
 * To promote testability and good coding practices we need to create an interface
 * for the scrapesite function. This allows us to pass each scraper's scapesite function
 * to our scrape multiple urls function.
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
        // Try to create a browser instance and store it to the variable
        let browserInstance;
        try {
            // The env variable HEADLESS sets if puppeteer should run headless (no chrome windows opening) or
            // headful (chrome windows opening and visible to the developer).
            // Casting a string "false" to a boolean becomes true. So we use the below to avoid this.
            // IN PRODUCTION AND CI THIS MUST BE TRUE
            let runHeadless;
            if (process.env.HEADLESS === "false") {
                runHeadless = false;
            } else {
                runHeadless = true;
            }
            // Creates a browser instance before we scrape the site.
            // This allows us to run concurrent scrape jobs, where each instance scrapes the URL.
            browserInstance = await createBrowserInstance(runHeadless);
        } catch (error) {
            // Log that the browser instance failed to create for the current url and why it failed to create
            logger.error(
                `Failed to create browser instance for: ${url} Resulted in Error: `,
                error
            );
            return null;
        }
        // If we made it here then we have a browserInstance and we are ready to scrape the current url
        try {
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
            // Log the url that failed to scrape and the error message
            logger.error(`Error scraping ${url}:`, error);
            // Close the browser instance that failed
            await browserInstance.close();
            // Return null for the result
            return null;
        }
    });
    return Promise.all(scrapePromises);
};
