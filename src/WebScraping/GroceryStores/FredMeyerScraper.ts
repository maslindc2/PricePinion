/**
 * This is the Fred Meyer web scraper which is responsible for scraping all of the products from Fred Meyer.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */


import { Browser, ElementHandle, Page } from "puppeteer";
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
    
    // call scrape page function
    const scrapeResult = await scrapePage(page);

    // Close the current browser instance
    await browser.close();
    // return the results from scraping the requested page
    return await scrapeResult;
};

/**
 * This function is responsible for scraping the current webpage.
 * @param page This is the current page of the web browser
 * @returns Returns the product data we have extracted from the current page.
 */
const scrapePage = async (page:Page) => {
    // We wait for the .AutoGrid class to load (this is the product grouping).
    const productGridContainer = await page.waitForSelector(".AutoGrid");
    // If the product grid container is undefined then we failed to find a div with the class AutoGrid
    if(!productGridContainer){
        console.error("Failed to locate .AutoGrid element!");
        return null;
    }

    // Target all classes and child elements that have the following class structure
    const productsGrid = await productGridContainer.$$('.AutoGrid-cell > .kds-Card > *');

    const productData = [];
    
    // For each product that matches the above class structure
    for (const product of productsGrid){
        // Extract the current product image URL
        const productImage = await extractProductImage(product, ".kds-Link > .h-full > .kds-Image-img");
        // Extract the current product price using the current product cell and the class structure
        // The class structure here is just class=kds-Price--alternate this is only used for the product price.
        const productPrice = await extractFromAria(product, ".kds-Price--alternate");
        
        // Extract the current product name using the current product and the class structure
        // The class structure for product name always has the parent tag with a class="mb-4" and a child with class="kds-link"
        // Why not just target kds-link? This class is reused again throughout for other elements so we need to follow this structure
        const productName = await extractFromAria(product, ".mb-4 > .kds-Link");
        
        // Extract the current product URL using the current product and targeting the same element as above
        const productURL = await extractProductURL(product, ".mb-4 > .kds-Link");

        //TODO: I need to do some preprocessing on the products grid thanks to empty tags, this avoids that issue for now
        if(productImage){
            productData.push(productImage);
        }
        if(productPrice){
            productData.push(productPrice);
        }
        if(productName){
            productData.push(productName);
        }
        if(productURL){
            productData.push(productURL);
        }
    }
    return productData;
}

/**
 * This function is responsible for extracting the product image
 * @param product This is the individual product cell
 * @param classStructure This is the class structure of the element we wish to extract. 
 * @returns The image tag's source value. We'll save the image in the future. 
 */
const extractProductImage = async (product:ElementHandle, classStructure: string) => {
    const productImage = await product.$(classStructure);
    if(productImage){
        return productImage.evaluate((element) => element.getAttribute("src"));
    }else{
        return null;
    }
}

/**
 * This function is responsible for extracting the current product's URL.
 * @param product This is the individual product cell
 * @param classStructure This is the class structure of the element we wish to extract. 
 * @returns The product's URL.
 */
const extractProductURL = async (product:ElementHandle, classStructure: string) => {
    const productURL = await product.$(classStructure);
    if(productURL){
        const productHREF = await productURL.evaluate((element) => element.getAttribute("href"));
        return "https://www.fredmeyer.com" + productHREF;
    }else{
        return null;
    }
}

/**
 * This function is resonsible for extracting information from a Tag's AriaLabel.
 * AriaLabel's contain product names and prices on Kroger sites so we can reuse this function for both.
 * @param product This is the individual product cell
 * @param classStructure This is the class structure of the element we wish to extract. 
 * @returns The aria label for an element. Returns null if the element wasn't found
 */
const extractFromAria = async (product:ElementHandle, classStructure: string) => {
    const productElement = await product.$(classStructure);
    if(productElement){
        return productElement.evaluate((element) => element.ariaLabel);
    }else{
        return null;
    }
}

/**
 * This is the Fred Meyer scraper function. 
 * Function creates a browser instance and then scrapes the url provided.
 * TODO: Add Load More items support, function will continue to load items until the load more items button is not present.
 * @returns the result from scraping Fred Meyer
 */
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
