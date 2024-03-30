/**
 * This is the Fred Meyer web scraper which is responsible for scraping all of the products from Fred Meyer.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */


import { Browser } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * Creating a browser instance. 
 * When you run the scraper, no browser will open because it's headless. 
 * Replace puppeteer.launch with puppeteer.launch({headless: true}) to show a browser windows.
 * @returns browser instance that the webscraper can utilize. 
 */
const createBrowserInstance = async (): Promise<Browser> => {
    // Tell the puppeteer object to use the Stealth plugin
    puppeteer.use(StealthPlugin());
    
    // Create a browser instance
    const browser = await puppeteer.launch();
    // Return the browser instance we created.
    return browser;
}

/**
 * This is the scraping function that performs the web scraping
 * @param url URL we are going to scrape
 * @param browser browser instance to use for scraping 
 * @returns The items that we have successfully scraped
 */
// We starting with scraping the Baby Food section of FredMeyer as it's only 71 products
const scrapeSite = async (url: string, browser: Browser) => {
    // Open a new blank page
    const page = await browser.newPage();
    // Navigate to the target page
    await page.goto(url);

    // Below is the main scrapping operation.
    // We wait for the .AutoGrid class to load (this is the product grouping).
    const scrapeResult = await page.waitForSelector(".AutoGrid").then(async (elementContainer) => {
        // If the element container is defined then we can process the child elements
        if(elementContainer){
            // Store all products that match the below class structure
            // Autogrid-cell > .kds-Card is the individual product card and we extract all elements under that
            const productsGrid = await elementContainer?.$$('.AutoGrid-cell > .kds-Card > *');
            // Create a product data array for storing information about the products on the current page.
            const productData = [];

            // For each product in the products grid
            for(const product of productsGrid){
                // We first extract the price which has the class .kds-Price
                const priceElement = await product.$('.kds-Price').then(async (element) => {
                    // Thanks to screen readers existing we extract the Aria Label which contians the price of the current product.
                    return await element?.evaluate((element) => {
                        return element.ariaLabel;
                    });
                });
                // If the priceElement is defined then add it to the product data. 
                if(priceElement){
                    productData.push(priceElement);
                }
            }
            // Return the product data array.
            return productData;
        }else{
            return null;
        }
    }).catch((error) => {
        console.error("Failed to find .AutoGrid element!", error);
    })
    // Close the current browser instance
    await browser.close();
    // return the results from scraping the requested page
    return await scrapeResult;
};

export const fredMeyerScraper = async () => {
    // Printing that we are in this function
    console.log("Running Fred Meyer Scraping Job");

    // This is the url for the first page to scrape
    const url = "https://www.fredmeyer.com/pl/baby/18002?page=1";
    const browserInstance = await createBrowserInstance();
    
    // Wait till the scrapeSite function has finished then return the value.
    // If you are receiving undefined it's probably due to promises not resolving. 
    return await scrapeSite(url, browserInstance);
};
