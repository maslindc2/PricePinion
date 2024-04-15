/**
 * This is the Whole Foods web scraper which is responsible for scraping all of the products from Whole Foods.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */
import { logger } from "@logger";
import {
    extractProductImage,
    extractProductURL,
    extractTagValue,
} from "@scraper-extractors";
import {
    ProductInfo,
    scrapeMultipleURLs,
    sleepBeforeOperation,
} from "@scraper-utils";
import { Browser, ElementHandle } from "puppeteer";

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
    // Disable chrome location prompt
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(url, ["geolocation"]);

    // Open a new blank page
    const page = await browser.newPage();

    // Navigate to the target page and disable timeouts (used for our CI/CD pipeline)
    await page.goto(url, { timeout: 0 });

    // We wait for the w-pie--products-grid class to load (this is the grid of products).
    const productGridContainer = await page.waitForSelector(
        ".w-pie--products-grid"
    );

    // If the product grid container is undefined then we failed to find the product grid
    if (!productGridContainer) {
        logger.error(
            `Failed to locate w-pie--products-grid element! Aborting scrape job for ${url}`
        );
        return null;
    }

    // When Whole Foods loads it will prompt for a store location. This appears half the time
    // to avoid messing up the scraping job we attempt to look for it and close it.
    try {
        // Attempt to close the location prompt diaglogue box if it's unable to click close then it doesn't exist
        // Wait for the close button to appear and then close it
        await page
            .waitForSelector(
                ".main-content > .modal  > .modal--overlay > .modal--container > .modal--close"
            )
            .then(async () => {
                await page.click(
                    ".main-content > .modal  > .modal--overlay > .modal--container > .modal--close"
                );
            });
    } catch (error) {
        // If we are here the location prompt didn't load so we continue anyways
        logger.debug("Location prompt did not load, continuing anyways!");
    }

    // Whole Foods will not list prices unless it has a store location, even though they are the same across all stores
    // Wait for zip code box to appear then enter a zip code, delay key presses by 300 ms (allows time for stores to be displayed)
    await page
        .waitForSelector(".wfm-search-bar__wrapper > .wfm-search-bar--input")
        .then(async () => {
            await page.type(
                ".wfm-search-bar__wrapper > .wfm-search-bar--input",
                "98122",
                { delay: 300 }
            );
        });

    // Click on the first store that appears, this does not matter for us as it's only used
    // for in-store pick up and we must provide this to get prices.
    try {
        // Wait for the stores to appear
        await page.waitForSelector(".wfm-search-bar--list_item");
    } catch (error) {
        logger.error(
            `Failed to find list of stores, Aborting scrape for ${url}`
        );
        return null;
    }

    // Collect the list elements that appeared
    const storeList = await page.$$(".wfm-search-bar--list_item");
    try {
        // Click on the first store that appears in the search results
        storeList[0].click();
    } catch (error) {
        // If we are here we failed to click on a store
        logger.error(`Failed to set store for ${url}, Aborting scrape job!`);
        return null;
    }

    // Sleep for 1s as the page is currently refreshing
    // Cleanest way possible as we can't wait for refresh or wait for a selector to appear
    await sleepBeforeOperation(
        parseInt(<string>process.env.WF_REFRESH) || 1000
    );

    // If scrape recursively has been set i.e. we are loading all pages and then scraping the products.
    if (scrapeRecursively) {
        logger.debug("Scraping Recursively Enabled! This might take a bit!");
        let loadMoreResultsExists = true;
        while (loadMoreResultsExists) {
            try {
                // Wait for SCRAPE_DELAY ms (or if env is undefined wait 500ms) before clicking the next button.
                // This is tied to network speed so somtimes Whole Foods response times are slow sometimes they are fast.
                await sleepBeforeOperation(
                    parseInt(<string>process.env.SCRAPE_DELAY) || 3000
                ).then(async () => {
                    // Check if the Load More button exists, throws an error if it doesn't exist
                    await page
                        .$eval(
                            ".w-pie--body-content > .w-button--load-more",
                            (button) => button !== null
                        )
                        .then(async () => {
                            // If the above didn't throw an error, then the button exists and we click it.
                            await page.click(
                                ".w-pie--body-content > .w-button--load-more"
                            );
                        });
                });
            } catch (error) {
                // If we are here then the Load More Results button no longer exists
                loadMoreResultsExists = false;
            }
        }
        // Scrape all of the products in the product grid container
        const scrapedProducts = await scrapePage(productGridContainer);
        // return the array of scraped products
        return scrapedProducts;
    } else {
        // Here we scrape only the first page
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
    const productsGrid = await productGridContainer.$$(
        ".w-pie--products-grid > *"
    );
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
        // Whole Foods shows prices in two ways either on sale or normal
        let productPrice;
        // If the product is on sale it uses the below class structure
        productPrice = await extractTagValue(
            product,
            ".bds--heading-5 > .bds--heading-5"
        );
        // If the product price is NOT on sale, it uses the below class structure
        if (productPrice === null) {
            productPrice = await extractTagValue(
                product,
                ".w-pie--product-tile__content > .bds--heading-5"
            );
        }
        // If all fields are defined then we have successfully extracted product information
        // If any one of these variables are undefined then we failed to extract the product information.
        const productInfo: ProductInfo = {
            name: productName,
            image: productImage,
            price: productPrice,
            url: productURL,
        };
        // Add the product info to the product data array
        productData.push(productInfo);
    }
    return productData;
};

/**
 * This is the Whole Foods scraper function.
 * This function defines an array of URL's that we pass to scrapeMultipleURLS,
 * where the scraping is done concurrently.
 * @returns the result from scraping Whole Foods
 */
export const wholeFoodsScraper = async () => {
    // Printing that we are in this function
    logger.info("Running Whole Foods Scraping Job");

    // Here we are defining the array of urls that we are going to scrape.
    const urls = [
        "https://www.wholefoodsmarket.com/products/meat",
        "https://www.wholefoodsmarket.com/products/seafood",
        "https://www.wholefoodsmarket.com/products/produce",
        "https://www.wholefoodsmarket.com/products/dairy-eggs/milk-cream",
        "https://www.wholefoodsmarket.com/products/dairy-eggs/cheese",
        "https://www.wholefoodsmarket.com/products/dairy-eggs/butter-margarine",
        "https://www.wholefoodsmarket.com/products/dairy-eggs/eggs",
    ];

    // Here we will scrape multiple URLs concurrently.
    // NOTE: If scrapeRecursively (second parameter) is set to true, this will scrape all pages of the url. False only scrapes the first page.
    // Third parameter is the scrape site function built specifically for Whole Foods
    const result = await scrapeMultipleURLs(urls, false, scrapeSite);

    // Return the result of our product scraping.
    return result;
};
