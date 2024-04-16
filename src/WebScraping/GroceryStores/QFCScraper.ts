import { logger } from "@logger";
import { Browser, ElementHandle } from "puppeteer";
import {
    ProductInfo,
    scrapeMultipleURLs,
    sleepBeforeOperation,
} from "@scraper-utils";
import {
    extractProductImage,
    extractProductURL,
    extractFromAria,
    extractFromValue,
} from "@scraper-extractors";

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
    await page.goto(url, { timeout: 0 });

    // We wait for the .AutoGrid class to load (this is the grid of products).
    const productGridContainer = await page.waitForSelector(".AutoGrid");

    // If the product grid container is undefined then we failed to find a div with the class AutoGrid
    if (!productGridContainer) {
        return null;
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
                // This is tied to network speed. QFC response times are slow and sometimes they are fast.
                await sleepBeforeOperation(
                    parseInt(<string>process.env.CLICK_DELAY) || 500
                ).then(async () => {
                    // Check if the Load More Results button exists, throws an error if it doesn't exist
                    // We have to use the below class structure because they reuse the class "LoadMore__load-more-button"
                    // for the load previous results button too.
                    await page
                        .$eval(
                            ".mt-32 > .LoadMore__load-more-button",
                            (button) => button !== null
                        )
                        .then(async () => {
                            // If the above didn't throw an error, then the button exists and we click it.
                            await page.click(
                                ".mt-32 > .LoadMore__load-more-button"
                            );
                        });
                });
            } catch (error) {
                // If we are here then the Load More Results button no longer exists
                loadMoreResultsExists = false;
            }
        }

        // Once all the products have been loaded we can start scraping.
        // Due to how QFC loads elements the website might lag before rendering the final products.
        // To Fix this we sleep for SCRAPE_DELAY seconds (5 seconds if env is not defined) and then scrape the products.
        const scrapedProducts = sleepBeforeOperation(
            parseInt(<string>process.env.SCRAPE_DELAY) || 3000
        ).then(async () => {
            // Scrape all of the products in the product grid container
            const scrapedProducts = await scrapePage(productGridContainer);
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
        const productPrice = await extractFromValue(
            product,
            ".kds-Price--alternate"
        );

        // Extract the current product URL using the current product and targeting the same as product name
        // Kroger shortens the URL to just be p/product-id so we need to add the base url for the site.
        const productURL = await extractProductURL(
            "https://www.qfc.com",
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
 * This is the QFC scraper function.
 * This function defines an array of URL's that we pass to scrapeMultipleURLS,
 * where the scraping is done concurrently.
 * @returns the result from scraping QFC
 */
export const qfcScraper = async () => {
    // Printing that we are in this function
    logger.info("Running QFC Scraping Job");

    // Here we are defining the array of urls that we are going to scrape.
    const urls = [
        "https://www.qfc.com/pl/meat-seafood/18004",
        "https://www.qfc.com/pl/fresh-vegetables/06112",
        "https://www.qfc.com/pl/milk-plant-based-%20milk/02001",
        "https://www.qfc.com/pl/cheese/02002",
        "https://www.qfc.com/pl/butter-margarine/02004",
        "https://www.qfc.com/pl/eggs-egg-substitutes/02003",
    ];
    // Here we will scrape multiple URLs concurrently.
    // NOTE: If scrapeRecursively (second parameter) is set to true, this will scrape all pages of the url. False only scrapes the first page.
    // Third parameter is the scrape site function built specifically for QFC
    const result = await scrapeMultipleURLs(urls, false, scrapeSite);
    logger.info("Finished QFC Scraping Job");
    // Return the result of our product scraping.
    return result;
};
