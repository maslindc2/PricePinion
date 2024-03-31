/**
 * This is the Fred Meyer web scraper which is responsible for scraping all of the products from Fred Meyer.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */

import { Browser, ElementHandle } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

/**
 * Creating a browser instance.
 * Set headless for puppeteer.launch to false if you want to see a browser window and scraping actions.
 * @returns {Promise<Browser>} browser instance that the webscraper can utilize.
 */
const createBrowserInstance = async (): Promise<Browser> => {
    // Tell the puppeteer object to use the Stealth plugin to avoid sites decting that we are scraping them.
    puppeteer.use(StealthPlugin());
    // Create a browser instance
    const browser = await puppeteer.launch({ headless: false });
    // Return the browser instance we created.
    return browser;
};

/**
 * This is a function to delay the execution of certain tasks, sometimes the website loads slowly
 * this prevents any problems with skipping products or elements because they haven't loaded.
 * TODO Figure out a better solution for this.
 * @param ms number of ms to sleep for
 * @returns a resolved promise once the timeout has finished
 */
const sleepBeforeOperation = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * This is the scraping function that performs the web scraping.
 * @param {string} url URL we are going to scrape
 * @param {Browser} browser browser instance to use for scraping
 * @param {boolean} scrapeRecursively scrapes all the pages of the provided url. If set to false: only the first page is scraped.
 * @returns The items that we have successfully scraped
 */
const scrapeSite = async (
    url: string,
    browser: Browser,
    scrapeRecursively: boolean
) => {
    // Open a new blank page
    const page = await browser.newPage();

    // Navigate to the target page
    await page.goto(url);

    // We wait for the .AutoGrid class to load (this is the grid of products).
    const productGridContainer = await page.waitForSelector(".AutoGrid");

    // If the product grid container is undefined then we failed to find a div with the class AutoGrid
    if (!productGridContainer) {
        console.error("Failed to locate .AutoGrid element!");
        return null;
    }
    // If scrape recursively has been set i.e. we are loading all pages and then scraping the products.
    if (scrapeRecursively) {
        console.log("Scraping Recursively Enabled!\nThis might take a bit!");
        // This is variable used for checking if the Load More Results button exists
        let loadMoreResultsExists = true;
        // The below loop continues to load items on the page until the Load More Results button no longer exists.
        while (loadMoreResultsExists) {
            try {
                // Wait for 500ms before clicking the next button. Fred Meyer is sometimes slow with rendering the buttons.
                await sleepBeforeOperation(500).then(async () => {
                    // Check if the Load More Results button exists, throws an error if it doesn't exist
                    // We have to use the below class structure because they reuse the class "LoadMore__load-more-button" 
                    // for the load previous results button too. 
                    loadMoreResultsExists = await page.$eval(
                        ".mt-32 > .LoadMore__load-more-button",
                        (button) => button !== null
                    );
                    // If the above didn't throw an error, then the button exists and we click it.
                    await page.click(".mt-32 > .LoadMore__load-more-button");
                });
            } catch (error) {
                // If we are here then the Load More Results button no longer exists
                loadMoreResultsExists = false;
            }
        }

        // Once all the products have been loaded we can start scraping.
        // Due to how Fred Meyer loads elements the website might lag before rendering the final products.
        // To Fix this we sleep for 5 seconds and then scrape the products. 
        // TODO: Come up with a better way to fix this issue.
        const scrapedProducts = sleepBeforeOperation(5000).then(async () => {
            // Scrape all of the products in the product grid container
            const scrapedProducts = await scrapePage(productGridContainer);
            // Once scraping has finished close the page.
            await page.close();
            // return the array of scraped products
            return scrapedProducts;
        });

        // return the results from scraping the requested page
        return scrapedProducts;
    } else {
        // call scrape page function
        const pageData = await scrapePage(productGridContainer);
        // return the results from scraping the requested page
        return pageData;
    }
};

/**
 * Used for storing information about products.
 * Currently these fields can either be strings or null.
 * We can change the types later on when we start designing the DB part.
 */
interface ProductInfo {
    name: string | null;
    image: string | null;
    price: string | null;
    url: string | null;
}

/**
 * This function is responsible for scraping the current webpage.
 * @param page This is the current page of the web browser
 * @returns Returns the product data we have extracted from the current page.
 */
const scrapePage = async (productGridContainer: ElementHandle<Element>) => {
    // Target all classes and child elements that have the following class structure
    const productsGrid = await productGridContainer.$$(".AutoGrid-cell > *");
    // Used for storing the current page as an array of products.
    const productData = [];

    // For each product that matches the above class structure
    for (const product of productsGrid) {
        // Extract the current product name using the current product and the class structure
        // The class structure for product name always has the parent tag with a class="mb-4" and a child with class="kds-link"
        // Why not just target kds-link? This class is reused again throughout for other elements so we need to follow this structure.
        const productName = await extractFromAria(product, ".mb-4 > .kds-Link");

        // Extract the current product image URL
        const productImage = await extractProductImage(
            product,
            ".kds-Link > .h-full > .kds-Image-img"
        );

        // Extract the current product price using the current product cell and the class structure
        // The class structure here is just class=kds-Price--alternate this is only used for the product price.
        const productPrice = await extractFromAria(
            product,
            ".kds-Price--alternate"
        );

        // Extract the current product URL using the current product and targeting the same as product name
        const productURL = await extractProductURL(
            product,
            ".mb-4 > .kds-Link"
        );

        // If all fields are defined then we have successfully extracted product information
        // If any one of these variables are undefined then we failed to extract the product information
        const productInfo: ProductInfo = {
            name: productName,
            image: productImage,
            price: productPrice,
            url: productURL,
        };

        productData.push(productInfo);
    }
    return productData;
};

/**
 * This function is responsible for extracting the product image
 * @param product This is the individual product cell
 * @param classStructure This is the class structure of the element we wish to extract.
 * @returns The image tag's source value. We'll save the image in the future. Returns null if the element wasn't found.
 */
const extractProductImage = async (
    product: ElementHandle,
    classStructure: string
) => {
    const productImage = await product.$(classStructure);
    if (productImage) {
        return productImage.evaluate((element) => element.getAttribute("src"));
    } else {
        return null;
    }
};

/**
 * This function is responsible for extracting the current product's URL.
 * @param product This is the individual product cell
 * @param classStructure This is the class structure of the element we wish to extract.
 * @returns The product's URL. Returns null if the element wasn't found.
 */
const extractProductURL = async (
    product: ElementHandle,
    classStructure: string
) => {
    const productURL = await product.$(classStructure);
    if (productURL) {
        const productHREF = await productURL.evaluate((element) =>
            element.getAttribute("href")
        );
        return "https://www.fredmeyer.com" + productHREF;
    } else {
        return null;
    }
};

/**
 * This function is resonsible for extracting information from a Tag's AriaLabel.
 * AriaLabel's contain product names and prices on Kroger sites so we can reuse this function for both.
 * @param product This is the individual product cell
 * @param classStructure This is the class structure of the element we wish to extract.
 * @returns The aria label for an element. Returns null if the element wasn't found
 */
const extractFromAria = async (
    product: ElementHandle,
    classStructure: string
) => {
    const productElement = await product.$(classStructure);
    if (productElement) {
        return productElement.evaluate((element) => element.ariaLabel);
    } else {
        return null;
    }
};

/**
 * The below function is responsible for scraping multiple sites at a time.
 * The Fred Meyer scraper function can either scrape one page or run concurrent scrape jobs.
 */
const scrapeMultipleURLs = async (
    urls: string[],
    browserInstance: Browser,
    scrapeRecursively: boolean
) => {
    // Map all of the URLS to an array of promises
    const scrapePromises = urls.map(async (url) => {
        try {
            // Run scrape site with the current URL
            return await scrapeSite(url, browserInstance, scrapeRecursively);
        } catch (error) {
            console.error(`Error scraping ${url}:`, error);
            return null;
        }
    });
    return Promise.all(scrapePromises);
};

/**
 * This is the Fred Meyer scraper function.
 * Function creates a browser instance and then scrapes the url provided.
 * @returns the result from scraping Fred Meyer
 */
export const fredMeyerScraper = async () => {
    // Printing that we are in this function
    console.log("Running Fred Meyer Scraping Job");

    // This is the browser instance Puppeteer will use for the scraping.
    const browserInstance = await createBrowserInstance();

    // We will first scrape Baby Food which is 72 products and also scrape Fresh Vegetables which only contains 264 products (even though they say 484 results);
    const urls = [
        "https://www.fredmeyer.com/pl/baby/18002?page=1",
        "https://www.fredmeyer.com/pl/fresh-vegetables/06112?",
    ];

    // Here we will scrape multiple URLs sequnetially.
    // TODO: Set this up as concurrent operations
    // NOTE: If scrapeRecursively (third parameter) is set to true, this will scrape all pages of the url. False only scrapes the first page.
    // Requires a url array, browser instance, and scrapRecursively set to either true or false.
    const result = await scrapeMultipleURLs(urls, browserInstance, true);

    // Close the browser instance once finished.
    // We only have one instance as each url is going to be in it's own tab.
    await browserInstance.close();
    // Return the result of our product scraping.
    return result;
};
