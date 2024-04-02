/**
 * This is the Fred Meyer web scraper which is responsible for scraping all of the products from Fred Meyer.
 * We utilize a few libraries called Puppeteeer and Puppeteer Stealth.
 * Puppeteer Stealth is used to hide the fact that we are scraping their website headlessly.
 */
import { logger } from "@logger";
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
    const browser = await puppeteer.launch({ headless: true });
    // Return the browser instance we created.
    return browser;
};

/**
 * This is a function to delay the execution of certain tasks, sometimes the website loads slowly
 * this prevents any problems with skipping products or elements because they haven't loaded.
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
        logger.error("Failed to locate .AutoGrid element!");
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
                // This is tied to network speed so somtimes Fred Meyer response times are slow sometimes they are fast.
                // Fred Meyer is sometimes slow with rendering the buttons.
                await sleepBeforeOperation(parseInt(<string>process.env.CLICK_DELAY) || 500).then(async () => {
                    // Check if the Load More Results button exists, throws an error if it doesn't exist
                    // We have to use the below class structure because they reuse the class "LoadMore__load-more-button"
                    // for the load previous results button too.
                    loadMoreResultsExists = await page.$eval(".mt-32 > .LoadMore__load-more-button", (button) => button !== null);
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
 * @param urls array of urls that we want to scrape.
 * @param scrapeRecursively sets if we are going to scrape all possible pages.
 * @returns The scraped product results from the promises.
 */
const scrapeMultipleURLs = async (
    urls: string[],
    scrapeRecursively: boolean
) => {
    // Map all of the URLS to an array of promises
    const scrapePromises = urls.map(async (url) => {
        try {
            // Creates a browser instance before we scrape the site.
            // This allows us to run concurrent scrape jobs, where each instance scrapes the URL.
            const browserInstance = await createBrowserInstance();
            // Run scrape site with the current URL and store the scraped products
            const scrapedProducts = await scrapeSite(
                url,
                browserInstance,
                scrapeRecursively
            );
            // Close the browser instance once finished.
            await browserInstance.close();
            // Return the scraped products
            return scrapedProducts;
        } catch (error) {
            logger.error(`Error scraping ${url}:`, error);
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
    logger.info("Running Fred Meyer Scraping Job");

    // We will first scrape Baby Food which is 72 products and also scrape Fresh Vegetables which only contains 264 products (even though they say 484 results);
    const urls = [
        "https://www.fredmeyer.com/pl/baby/18002?page=1",
        "https://www.fredmeyer.com/pl/fresh-vegetables/06112?",
    ];

    // Here we will scrape multiple URLs concurrently.
    // NOTE: If scrapeRecursively (second parameter) is set to true, this will scrape all pages of the url. False only scrapes the first page.
    // Requires a url array, and scrapRecursively set to either true or false.
    const result = await scrapeMultipleURLs(urls, true);

    // Return the result of our product scraping.
    return result;
};
