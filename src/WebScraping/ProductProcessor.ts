/**
 * This class is for storing products to our database.
 * This class also contains a development function that exports the scrape results to a JSON
 */
import fs from "fs";
import crypto from "crypto";
import { logger } from "@logger";
import { ProductModel } from "@product-model";

class ProductProcessor {
    private Products: ProductModel;
    constructor(Products: ProductModel) {
        this.Products = Products;
    }
    public async updateProducts(scrapeResults) {
        logger.info("Storing scrape results to the DB!");
        // For each store in the scrape results object
        for (const store in scrapeResults) {
            // Get the current store in the scrape results object
            let currStore = scrapeResults[store];
            // For each department in the current store
            for (const department of Object.keys(currStore)) {
                // Iterate through the products in that department
                for (const currProduct of currStore[department]) {
                    try {
                        // Get the current product from the DB, this will return a record if the product exists, or it will return null if it doesn't
                        const productRecord =
                            await this.Products.retireveProductByName(
                                currProduct.productName
                            );
                        // If product does exist in the database
                        if (productRecord) {
                            // Check if it's at the current store, if it does we update the product's information
                            const doesProductExistAtCurrStore =
                                await this.Products.checkIfProductExistsAtCurrStore(
                                    currProduct.productName,
                                    currProduct.storeName
                                );
                            // TODO: Create update product function, if the product exists in the DB update it. Currently only add the product if it does not exist yet.
                            // If the product does not exist at the current store we will add it to the product comparison section
                            if (!doesProductExistAtCurrStore) {
                                await this.addToProductComparison(
                                    productRecord,
                                    currProduct
                                );
                            }
                        } else {
                            try {
                                //If the product does not exist AT ALL in the database we create it.
                                this.createNewProduct(currProduct);
                            } catch (error) {
                                // If the product failed to create log the error
                                logger.error(error);
                            }
                        }
                    } catch (error) {
                        logger.error(
                            `Object creation/update failed! Error: ${error}`
                        );
                    }
                }
            }
        }
        logger.info("Finished storing scrape results to the DB!");
    }
    private async createNewProduct(currProduct){
        // Since we are saving the product for the first time we are going to create a productID
        const id = crypto.randomBytes(16).toString("hex");
        currProduct.productID = id;

        // Create the product using the current product object
        await this.Products.model.create(currProduct);
    }
    private async addToProductComparison(productRecord, currProduct) {
        // Check if the currProduct already exists in the productComparison array on the DB.
        // If it does check if we need to update it
        const productComparison = productRecord.productComparison;
        const result = productComparison.find(
            (product) =>
                product.productName === currProduct.productName &&
                product.storeName === currProduct.storeName
        );
        if (!result) {
            // If the product does not exist at the current store we will add it to the product comparison section
            productRecord.productComparison.push(currProduct);
            await productRecord.save();
        }
    }
    /**
     * DEVELOPMENT ONLY FUNCTION
     * This allows you to write the results from the scrapers to JSON files
     * @param scrapeResults Object containing results from the 3 scrapers
     */
    public resultToJSON(scrapeResults: any): void {
        // Create a folder called ScrapeResults
        if (!fs.existsSync("ScrapeResults")) {
            fs.mkdirSync("ScrapeResults");
        }
        const scrapeResultsAsJSON = JSON.stringify(scrapeResults);
        // Write the results from FredMeyer to a json
        fs.writeFileSync(
            "ScrapeResults/Scrape_Results.json",
            scrapeResultsAsJSON,
            {
                flag: "w",
            }
        );
        logger.info(
            "Wrote scrape results to JSON's in the directory ScrapeResults"
        );
        logger.info(
            "Make sure to execute 'npm run format' to format the ugly json output!"
        );
    }
    /**
     * DEVELOPMENT ONLY FUNCTION
     * This allows you to take the scraper results from a JSON and make an object
     * @returns scrapeResults Object containing results from the 3 scrapers
     */
    public jsonResultsToObject(): void {
        const scrapeResultsAsJSON = fs.readFileSync(
            "ScrapeResults/Scrape_Results.json",
            { encoding: "utf8", flag: "r" }
        );
        const scrapeResults = JSON.parse(scrapeResultsAsJSON);
        return scrapeResults;
    }
}
export { ProductProcessor };
