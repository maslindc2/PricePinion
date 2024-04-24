/**
 * This is the Web Scraper controller for handling the web scraping jobs.
 * The controller will tell each of the grocery store scrapers to run.
 */
import fs from "fs";
import { logger } from "@logger";
import { FredMeyerScraper } from "@store-scrapers/FredMeyerScraper";
import { QFCScraper } from "@store-scrapers/QFCScraper";
import { WholeFoodsScraper } from "@store-scrapers/WholeFoodsScraper";

class WebScraperController {
    public fmScraperObj: FredMeyerScraper;
    public qfcScraperObj: QFCScraper;
    public wfScraperObj: WholeFoodsScraper;
    constructor() {
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
        const qfcScrapeResult: Object = await this.qfcScraperObj.qfcScraper();
        const wholeFoodsScrapeResult: Object =
            await this.wfScraperObj.wholeFoodsScraper();

        const scrapeResults = {
            FredMeyer: fredMeyerScrapeResult,
            QFC: qfcScrapeResult,
            WholeFoods: wholeFoodsScrapeResult,
        };
        return scrapeResults;
    }
    /**
     * DEVELOPMENT ONLY FUNCTION
     * This allows you to write the results from the scrapers to JSON files
     * This function will be removed!
     * @param scrapeResults Object containing results from the 3 scrapers
     */
    public resultToJSON(scrapeResults: any): void {
        // Once we have the data stringify it for exporting to a json file
        const fmAsJson = JSON.stringify(scrapeResults.FredMeyer);
        const qfcAsJson = JSON.stringify(scrapeResults.QFC);
        const wfAsJson = JSON.stringify(scrapeResults.WholeFoods);

        // Create a folder called ScrapeResults
        if (!fs.existsSync("ScrapeResults")) {
            fs.mkdirSync("ScrapeResults");
        }

        // Write the results from FredMeyer to a json
        fs.writeFileSync(
            "ScrapeResults/FredMeyer_Scrape_Results.json",
            fmAsJson,
            {
                flag: "w",
            }
        );
        // Write the results from QFC to a json
        fs.writeFileSync("ScrapeResults/QFC_Scrape_Results.json", qfcAsJson, {
            flag: "w",
        });

        // Write the results from WholeFoods to a json
        fs.writeFileSync(
            "ScrapeResults/WholeFoods_Scrape_Results.json",
            wfAsJson,
            {
                flag: "w",
            }
        );
        logger.info(
            "Wrote scrape results to JSON's in the directory ScrapeResults"
        );
        logger.info(
            "Make sure to execute 'npm run format' to format the ugly json output!"
        );
    }
}
export { WebScraperController };
