/**
 * This is the Fred Meyer web scraper which is responsible for scraping all of the products from Fred Meyer.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// We starting with scraping the Baby Food section of FredMeyer as it's only 71 products
// TODO: Turn this function into something that can be reused and not hardcoded
const scrapeSite = async (url: string) => {
    // Tell the puppeteer object to use the Stealth plugin
    puppeteer.use(StealthPlugin());
    // Set up the browser and launch it
    const browser = await puppeteer.launch();
    // Open a new blank page
    const page = await browser.newPage();
    // Navigate to the target page
    await page.goto(url);

    // Finding the first h1 which is the title "Baby"
    const resultElement = await page.$("h1");
    const message = await resultElement?.evaluate((e) => e.textContent);

    // Close the browser
    await browser.close();
    // Return the value for the first h1
    return message;
};

export const fredMeyerScraper = async () => {
    // Printing that we are in this function
    console.log("Running Fred Meyer Scraping Job");

    // This is the url for the first page to scrape
    const url = "https://www.fredmeyer.com/pl/baby/18002?page=1";

    // waiting till the scrape has finished before we return the data from the function
    // This is just temporary I'll have this looking good soon.
    return await scrapeSite(url);
};
