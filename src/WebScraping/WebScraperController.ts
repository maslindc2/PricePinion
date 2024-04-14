/**
 * This is the Web Scraper controller for handling the web scraping jobs.
 * The controller will tell each of the grocery store scrapers to run.
 */
import { logger } from "@logger";
import { fredMeyerScraper } from "@store-scrapers/FredMeyerScraper";
import { qfcScraper } from "@store-scrapers/QFCScraper";
import { wholeFoodsScraper } from "@store-scrapers/WholeFoodsScraper";

export const webScraperController = async () => {
    // Logging that we running the Webscraper controller
    logger.debug("Reached WebScraper Controller");
    
    // Run the FredMeyer and QFC webscraper once we have the data the print it to the console.
    const fredMeyerScrapeResult = await fredMeyerScraper();
    const qfcScrapeResult = await qfcScraper();
    const wholeFoodsScrapeResult = await wholeFoodsScraper();

    logger.info("Fred Meyer Scrape Results");
    for (let index = 0; index < fredMeyerScrapeResult.length; index++) {
        // We are currently only printing the size of the scrape result array for each URL
        logger.info(
            `Scraped URL Number ${index + 1} resulted in ${fredMeyerScrapeResult[index]?.length} products scraped.`
        );
    }
    logger.info("QFC Scrape Results");
    for (let index = 0; index < qfcScrapeResult.length; index++) {
        // We are currently only printing the size of the scrape result array for each URL
        logger.info(
            `Scraped URL Number ${index + 1} resulted in ${qfcScrapeResult[index]?.length} products scraped.`
        );
    }    
    logger.info("Whole Foods Scrape Results");
    for (let index = 0; index < wholeFoodsScrapeResult.length; index++) {
        // We are currently only printing the size of the scrape result array for each URL
        logger.info(
            `Scraped URL Number ${index + 1} resulted in ${wholeFoodsScrapeResult[index]?.length} products scraped.`
        );
    }
};
