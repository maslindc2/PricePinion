import { logger } from "@logger";
import { Browser, ElementHandle } from "puppeteer";
import { Extractors } from "@scraper-extractors";
import { IProductInfo } from "src/interfaces/IProductInfo";
import { ScraperUtils } from "@scraper-utils";

class QFCScraper {
    public scraperUtilObj: ScraperUtils;
    constructor() {
        this.scraperUtilObj = new ScraperUtils();
    }

    /**
     * This is the scraping function that performs the web scraping.
     * @param {string} url URL we are going to scrape
     * @param {Browser} browser browser instance to use for scraping
     * @param {boolean} scrapeRecursively scrapes all the pages of the provided url. If set to false: only the first page is scraped.
     * @returns The items that we have successfully scraped
     */
    public async scrapeSite(
        url: string,
        browser: Browser,
        scrapeRecursively: boolean
    ) {
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
            logger.debug(
                "Scraping Recursively Enabled! This might take a bit!"
            );
            // This is variable used for checking if the Load More Results button exists
            let loadMoreResultsExists = true;
            // The below loop continues to load items on the page until the Load More Results button no longer exists.
            while (loadMoreResultsExists) {
                try {
                    // Wait for CLICK_DELAY ms (or if env is undefined wait 500ms) before clicking the next button.
                    // This is tied to network speed. QFC response times are slow and sometimes they are fast.
                    await this.scraperUtilObj
                        .sleepBeforeOperation(
                            parseInt(<string>process.env.CLICK_DELAY) || 500
                        )
                        .then(async () => {
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
            const scrapedProducts = this.scraperUtilObj
                .sleepBeforeOperation(
                    parseInt(<string>process.env.SCRAPE_DELAY) || 3000
                )
                .then(async () => {
                    // Scrape all of the products in the product grid container
                    const scrapedProducts =
                        await this.scrapePage(productGridContainer);
                    // return the array of scraped products
                    return scrapedProducts;
                });
            // return the results from scraping the requested page
            return scrapedProducts;
        } else {
            // call scrape page function
            const pageData = await this.scrapePage(productGridContainer);
            // return the results from scraping the requested page
            return pageData;
        }
    }

    /**
     * This function is responsible for scraping the current webpage.
     * @param page This is the current page of the web browser
     * @returns Returns the product data we have extracted from the current page.
     */
    public async scrapePage(productGridContainer: ElementHandle<Element>) {
        const extractorObj = new Extractors();
        // Target all classes and child elements that have the following class structure
        const productsGrid =
            await productGridContainer.$$(".AutoGrid-cell > *");
        // Used for storing the current page as an array of products.
        const productData = [];

        // For each product that matches the above class structure
        for (const product of productsGrid) {
            // Extract the current product name using the current product and the class structure
            // The class structure for product name always has the parent tag with a class="mb-4" and a child with class="kds-link"
            // Why not just target kds-link? This class is reused again throughout for other elements so we need to follow this structure.
            let productName = await extractorObj.extractFromAria(
                product,
                ".mb-4 > .kds-Link"
            );

            // Extract the current product image URL
            const productImage = await extractorObj.extractProductImage(
                product,
                ".kds-Link > .h-full > .kds-Image-img"
            );

            // With QFC we want to extract the price per pound for an item if it exists. We first attempt to collect that.
            // The price per pound for Kroger always follows the below pattern
            const pricePerPoundRegex = /^\$[\d.]+\/lb$/;
            // Attempt to extract the price per pound value and store it to productPrice
            let productPrice;
            productPrice = await extractorObj.extractTextContent(
                product,
                "div > * >.kds-Text--s"
            );
            // If the product price does not match the pattern then the span that displays price per pound does not exist and we need to collect
            // the default price tag.
            if (!pricePerPoundRegex.test(productPrice)) {
                // Extract the current product price using the current product cell and the class structure
                // The class structure here is just class=kds-Price--alternate this is only used for the product price.
                const priceValue = await extractorObj.extractFromValue(
                    product,
                    ".kds-Price--alternate"
                );
                productPrice = "$" + priceValue;
            }

            // Since some products utilize the same name with a different size we need to detect that an append it to the product name.
            // This element is especially hard to target so we use the below attribute to try and get it. Sometimes it might pick up the price per pound
            // Fortunately the product size takes precedence over price per pound.
            //let productSize = await product.$eval(`span[data-testid="cart-page-item-sizing"]`, element => element.innerHTML);
            let productSize = await extractorObj.extractTextContent(
                product,
                `span[data-testid="cart-page-item-sizing"]`
            );
            // Test that the string does not match the price per pound element.
            if (productSize && !pricePerPoundRegex.test(productSize)) {
                // Sometimes Kroger uses a non-breaking space character in HTML, we need to remove this garbage if it exists.
                if (productSize.includes("&nbsp;")) {
                    const nbspRegex = /&nbsp;/g;
                    productSize = productSize.replace(nbspRegex, "");
                }
                // Sometimes Kroger places a "|" in the product size, not sure why it's there, no idea why it doesn't render on the page, but it's there...
                if (productSize.includes("|")) {
                    const barRegex = /\|/g;
                    productSize = productSize.replace(barRegex, "");
                }
                // If the product size is simply 1 count we remove it as Kroger uses this on blatantly obvious items
                if (productSize === "1 ct") {
                    productSize = "";
                } else {
                    // Otherwise we can add the count to the product name
                    productName += ", " + productSize.trim();
                }
            } else {
                // If we got a price per pound then we set it to a blank string.
                productSize = "";
            }

            // Extract the current product URL using the current product and targeting the same as product name
            // Kroger shortens the URL to just be p/product-id so we need to add the base url for the site.
            const productURL = await extractorObj.extractProductURL(
                "https://www.qfc.com",
                product,
                ".mb-4 > .kds-Link"
            );

            // If all fields are defined then we have successfully extracted product information
            // If any one of these variables are undefined then we failed to extract the product information
            const productInfo: IProductInfo = {
                productName: productName,
                storeName: "QFC",
                productPrice: productPrice,
                productLink: productURL,
                productImage: productImage,
            };

            productData.push(productInfo);
        }
        return productData;
    }

    /**
     * This is the QFC scraper function.
     * This function defines an array of URL's that we pass to scrapeMultipleURLS,
     * where the scraping is done concurrently.
     * @returns the result from scraping QFC
     */
    public async qfcScraper() {
        // Printing that we are in this function
        logger.info("Running QFC Scraping Job");

        // Here we are defining the array of urls that we are going to scrape.
        const departmentURLs = {
            meat: "https://www.qfc.com/pl/meat-seafood/18004",
            produce:
                "https://www.qfc.com/pl/fresh-fruits-vegetables/06?taxonomyId=06&fulfillment=all",
            milk: "https://www.qfc.com/pl/milk-plant-based-%20milk/02001",
            cheese: "https://www.qfc.com/pl/cheese/02002",
            butter: "https://www.qfc.com/pl/butter-margarine/02004",
            eggs: "https://www.qfc.com/pl/eggs-egg-substitutes/02003",
        };
        // Here we will scrape multiple URLs concurrently.
        // NOTE: If scrapeRecursively (second parameter) is set to true, this will scrape all pages of the url. False only scrapes the first page.
        // Third parameter is the scrape site function built specifically for QFC
        const result = await this.scraperUtilObj.scrapeMultipleURLs(
            departmentURLs,
            false,
            this.scrapeSite.bind(this)
        );
        logger.info("Finished QFC Scraping Job");
        // Return the result of our product scraping.
        return result;
    }
}
export { QFCScraper };
