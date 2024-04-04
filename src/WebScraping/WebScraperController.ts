/**
 * This is the Web Scraper controller for handling the web scraping jobs.
 * The current theory is index.ts will call this function.
 * The controller will then tell each of the grocery store crawlers to run.
 * Storing the data to the DB could be handled in a different class we'll cross that bridge when we get to it.
 */
import { logger } from "@logger";
import { fredMeyerScraper } from "@store-scrapers/FredMeyerScraper";
export const webScraperController = async () => {
    // Logging that we running the Webscraper controller
    logger.debug("Reached WebScraper Controller");
    // Run the FredMeyer webscraper once we have the data the print it to the console.
    const scrapeResult = await fredMeyerScraper();
    for (let index = 0; index < scrapeResult.length; index++) {
        // We are currently only printing the size of the scrape result array for each URL
        logger.info(
            `Scraped URL Number ${index + 1} resulted in ${scrapeResult[index]?.length} products scraped.`
        );
    }
    return scrapeResult;
};
