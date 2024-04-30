/**
 * This is the Web Scraper controller for handling the web scraping jobs.
 * The controller will tell each of the grocery store scrapers to run.
 */
import { logger } from "@logger";
import { FredMeyerScraper } from "@store-scrapers/FredMeyerScraper";
import { QFCScraper } from "@store-scrapers/QFCScraper";
import { WholeFoodsScraper } from "@store-scrapers/WholeFoodsScraper";

class WebScraperController {
    public fmScraperObj: FredMeyerScraper;
    public qfcScraperObj: QFCScraper;
    public wfScraperObj: WholeFoodsScraper;
    constructor() {
        // Initalizing the scraper objects
        this.fmScraperObj = new FredMeyerScraper();
        this.qfcScraperObj = new QFCScraper();
        this.wfScraperObj = new WholeFoodsScraper();
    }

    // This function is responsible for running the scrapers. Call this to run the full scrape job.
    public async runWebScrapers(): Promise<Object> {
        // Logging that we are running the Webscraper controller
        logger.debug("Reached WebScraper Controller");
        // Runs Fred Meyer's Scraper and stores the results as an object
        const fredMeyerScrapeResult: Object =
            await this.fmScraperObj.fredMeyerScraper();
        // Runs QFC's Scraper and stores the results as an object
        const qfcScrapeResult: Object = await this.qfcScraperObj.qfcScraper();
        // Runs Wholefoods' Scraper and stores the results as an object
        const wholeFoodsScrapeResult: Object =
            await this.wfScraperObj.wholeFoodsScraper();

        //Create an object to store the results in
        const scrapeResults = {
            FredMeyer: fredMeyerScrapeResult,
            QFC: qfcScrapeResult,
            WholeFoods: wholeFoodsScrapeResult,
        };
        // Return the scrape result object
        return scrapeResults;
    }
}
export { WebScraperController };
