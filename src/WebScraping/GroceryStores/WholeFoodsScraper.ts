/**
 * This is the Whole Foods web scraper which is responsible for scraping all of the products from Whole Foods.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */
import { createBrowserInstance } from "@create-browser-instance";
import {logger} from "@logger";
import { extractPrice, extractProductImage, extractProductURL, extractTagValue } from "@scraper-extractors";
import { ProductInfo, sleepBeforeOperation } from "@scraper-utils";
import {Browser, ElementHandle} from "puppeteer"

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
    await page.goto(url, {timeout:0});

    // We wait for the w-pie--products-grid class to load (this is the grid of products).
    const productGridContainer = await page.waitForSelector(".w-pie--products-grid");

    // If the product grid container is undefined then we failed to find a div with the class w-pie--products-grid
    if (!productGridContainer) {
        logger.error("Failed to locate w-pie--products-grid element!");
        return null;
    }

    try {
        // Wait for CLICK_DELAY ms (or if env is undefined wait 500ms) before clicking the next button.
        // This is tied to network speed so somtimes Fred Meyer response times are slow sometimes they are fast.
        // Fred Meyer is sometimes slow with rendering the buttons.
        await sleepBeforeOperation(
            parseInt(<string>process.env.CLICK_DELAY) || 500
        ).then(async () => {
            // Check if the Load more button exists, throws an error if it doesn't exist
            await page.$eval(
                ".main-content > .modal  > .modal--overlay > .modal--container > .modal--close",
                (button) => button !== null
            );
            // If the above didn't throw an error, then the button exists and we click it.
            await page.click(".main-content > .modal  > .modal--overlay > .modal--container > .modal--close");
        });
    } catch (error) {
        logger.debug("See what's in store did not load continuing anyways!");
    }


    // If scrape recursively has been set i.e. we are loading all pages and then scraping the products.
    if (scrapeRecursively) {
        logger.debug("Scraping Recursively Enabled! This might take a bit!");
        // This is variable used for checking if the Load More Results button exists
        let loadMoreResultsExists = true;
        // The below loop continues to load items on the page until the Load More Results button no longer exists.
        while (loadMoreResultsExists) {
            try {
                // Wait for CLICK_DELAY ms (or if env is undefined wait 500ms) before clicking the next button.
                // This is tied to network speed so somtimes Fred Meyer response times are slow sometimes they are fast.
                // Fred Meyer is sometimes slow with rendering the buttons.
                await sleepBeforeOperation(
                    parseInt(<string>process.env.CLICK_DELAY) || 500
                ).then(async () => {
                    // Check if the Load more button exists, throws an error if it doesn't exist
                    loadMoreResultsExists = await page.$eval(
                        ".w-pie--body-content > .w-button--load-more",
                        (button) => button !== null
                    );
                    // If the above didn't throw an error, then the button exists and we click it.
                    await page.click(".w-pie--body-content > .w-button--load-more");
                });
            } catch (error) {
                // If we are here then the Load More Results button no longer exists
                loadMoreResultsExists = false;
            }
        }

        // Once all the products have been loaded we can start scraping.
        // Due to how Fred Meyer loads elements the website might lag before rendering the final products.
        // To Fix this we sleep for SCRAPE_DELAY seconds (5 seconds if env is not defined) and then scrape the products.
        const scrapedProducts = sleepBeforeOperation(
            parseInt(<string>process.env.SCRAPE_DELAY) || 3000
        ).then(async () => {
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
 * This function is responsible for scraping the current webpage.
 * @param page This is the current page of the web browser
 * @returns Returns the product data we have extracted from the current page.
 */
const scrapePage = async (productGridContainer: ElementHandle<Element>) => {
    // Target all classes and child elements that have the following class structure
    const productsGrid = await productGridContainer.$$(".w-pie--products-grid > *");
    // Used for storing the current page as an array of products.
    const productData = [];
    
    // For each product that matches the above class structure
    for (const product of productsGrid) {
        // Extract the current product image URL
        const productImage = await extractProductImage(
            product,
            ".w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__image > picture > img"
        );

        // Extract the current product URL using the current product and the below class structure
        // Whole Foods shortens the URL to just be /product/product-name so we need to add the base url for the site.
        const productURL = await extractProductURL(
            "https://www.wholefoodsmarket.com",
            product,
            ".w-pie--product-tile > .w-pie--product-tile__link"
        );
        // Extract the current product's name using the current product and the below class structure.
        const productName = await extractTagValue(
            product,
            ".w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__content > .w-cms--font-body__sans-bold"
        );
        // When an item goes on sale, Whole Foods removes the original price tag structure and replaces it with a special one for showing a discount.
        // Due to this we first check if the original tag structure is present, it's null then check if the item is on sale.
        const testing = await product.$$(".w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__content > .bds--heading-5");
        const prop = await testing[0].evaluate((element) => element.className);
        console.log(prop);

        // If all fields are defined then we have successfully extracted product information
        // If any one of these variables are undefined then we failed to extract the product information
        const productInfo: ProductInfo = {
            name: productName,
            image: productImage,
            price: "productPrice",
            url: productURL,
        };
        console.log(productInfo);
        productData.push(productInfo);
    } 
    return productData;
};

/**
 * This is the Fred Meyer scraper function.
 * This function defines an array of URL's that we pass to scrapeMultipleURLS,
 * where the scraping is done concurrently.
 * @returns the result from scraping Fred Meyer
 */
export const wholeFoodsScraper = async () => {
    // Printing that we are in this function
    logger.debug("Running Whole Foods Scraping Job");

    // Here we are defining the array of urls that we are going to scrape.
    /*
    const urls = [
        "https://www.fredmeyer.com/pl/meat-seafood/18004",
        "https://www.wholefoodsmarket.com/products/produce",
        "https://www.fredmeyer.com/pl/milk-plant-based-%20milk/02001",
        "https://www.fredmeyer.com/pl/cheese/02002",
        "https://www.fredmeyer.com/pl/butter-margarine/02004",
        "https://www.fredmeyer.com/pl/eggs-egg-substitutes/02003",
    ];**/

    // Here we will scrape multiple URLs concurrently.
    // NOTE: If scrapeRecursively (second parameter) is set to true, this will scrape all pages of the url. False only scrapes the first page.
    // Third parameter is the scrape site function built specifically for Fred Meyer
    //const result = await scrapeMultipleURLs(urls, false);
    const browser = await createBrowserInstance(true);
    const result = await scrapeSite("https://www.wholefoodsmarket.com/products/produce", browser, false);
    

    /**
     *  Product Link  is: .w-pie--products-grid > .w-pie--product-tile > .w-pie--product-tile__link 
        Product Image is: .w-pie--products-grid > .w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__image > picture > img
        Product Title is: .w-pie--products-grid > .w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__content > .w-cms--font-body__sans-bold
        Product Price with Sale: .w-pie--products-grid > .w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__content > .flex > .bds--heading-5 >.bds--heading-5
        Product Price wihtout sale: .w-pie--products-grid > .w-pie--product-tile > .w-pie--product-tile__link > .w-pie--product-tile__content > .bds--heading-5
     */

    // Return the result of our product scraping.
    return result;
};