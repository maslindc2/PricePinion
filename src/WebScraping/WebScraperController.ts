/**
 * This is the Web Scraper controller for handling the web scraping jobs.
 * The controller will tell each of the grocery store scrapers to run.
 */
import fs from "fs";
import { logger } from "@logger";
import { fredMeyerScraper } from "@store-scrapers/FredMeyerScraper";
import { qfcScraper } from "@store-scrapers/QFCScraper";
import { wholeFoodsScraper } from "@store-scrapers/WholeFoodsScraper";

export const webScraperController = async () => {
    // Logging that we running the Webscraper controller
    logger.debug("Reached WebScraper Controller");

    // Run the FredMeyer, QFC, and Whole Foods webscraper.
    const fredMeyerScrapeResult = await fredMeyerScraper();
    const qfcScrapeResult = await qfcScraper();
    const wholeFoodsScrapeResult = await wholeFoodsScraper();

    const scrapeResults = {
        FredMeyer: fredMeyerScrapeResult,
        QFC: qfcScrapeResult,
        WholeFoods: wholeFoodsScrapeResult
    }
    // If you want to output the result to JSON
    // Enable this function
    outputResultToJSON(scrapeResults);

    // If you want to write the results to the DB

};

const outputResultToJSON =  (scrapeResults: { FredMeyer: any; QFC: any; WholeFoods: any; }) => {
    // Once we have the data stringify it for exporting to a json file
    const fmAsJson = JSON.stringify(scrapeResults.FredMeyer);
    const qfcAsJson = JSON.stringify(scrapeResults.QFC);
    const wfAsJson = JSON.stringify(scrapeResults.WholeFoods);

    // Create a folder called ScrapeResults
    if (!fs.existsSync("ScrapeResults")) {
        fs.mkdirSync("ScrapeResults");
    }
    // Write the results from FredMeyer to a json
    fs.writeFileSync("ScrapeResults/FredMeyer_Scrape_Results.json", fmAsJson, {
        flag: "w",
    });
    // Write the results from FredMeyer to a json
    fs.writeFileSync("ScrapeResults/QFC_Scrape_Results.json", qfcAsJson, {
        flag: "w",
    });
    // Write the results from FredMeyer to a json
    fs.writeFileSync("ScrapeResults/WholeFoods_Scrape_Results.json", wfAsJson, {
        flag: "w",
    });
    logger.info(
        "Wrote scrape results to JSON's in the directory ScrapeResults"
    );
    logger.info(
        "Make sure to execute 'npm run format' to format the ugly json output!"
    );
}