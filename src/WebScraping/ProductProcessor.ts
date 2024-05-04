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
    /**
     * This function is responsible for processing the scrape results from our web scraper.
     * @param scrapeResults this is the scrape results object that is created from our web scraper.
     */
    public async processScrapeResults(scrapeResults) {
        logger.info("Storing scrape results to the DB!");
        try {
            // For each store in the scrape results object
            for (const store in scrapeResults) {
                // Get the current store in the scrape results object
                let currStore = scrapeResults[store];
                // For each department in the current store
                for (const department of Object.keys(currStore)) {
                    // Iterate through the products in that department
                    for (const currProduct of currStore[department]) {
                        // Process the current product
                        await this.processProduct(currProduct);
                    }
                }
            }
            logger.info("Finished storing scrape results to the DB!");
        } catch (error) {
            logger.error(`Failed to update products: ${error}`);
        }
    }
    /**
     * This function is responsible for either creating or adding a product to the productComparison array.
     * We first see if the current product exists in the database by retrieve the product by name.
     * If the product exists in the database, then we need to see if the product exists in the db at the current store.
     * -- If the product is oranges, and oranges are already in the DB at Fred Meyer, but we are currently looking at oranges at QFC,
     *    then we add the current product to the Oranges at Fred Meyer's product comparison array.
     * -- If the product at the current store already exists then we need to update the fields, if any need updating.
     * -- Otherwise if the product does not exist in the database, then we need to create it.
     * @param currProduct This is the current product we are processing.
     */
    private async processProduct(currProduct) {
        try {
            // Get the current product from the DB, this will return a record if the product exists, or it will return null if it doesn't
            const productRecord = await this.Products.retrieveProductByName(
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
                    await this.createNewProduct(currProduct);
                } catch (error) {
                    // If the product failed to create log the error
                    logger.error(error);
                }
            }
        } catch (error) {
            logger.error(`Object creation/update failed! Error: ${error}`);
        }
    }
    /**
     * This function is responsible for creating a new product in the DB.
     * If the product does not exist in the database, then we need to add it.
     * @param currProduct This is the current product we are looking at.
     */
    private async createNewProduct(currProduct) {
        // Since we are saving the product for the first time, we are going to create a productID
        const id = crypto.randomBytes(16).toString("hex");
        currProduct.productID = id;

        // Create the product using the current product object
        await this.Products.model.create(currProduct);
    }
    /**
     * This function is responsible for adding a product to an existing product's productComparison field.
     * Above we checked if the current product exists in the database. If we call this function that means the product exists
     * in the DB but it's not at the current store. In other words we found a product to compare.
     * We add it to the existing product's product comparison array.
     * @param productRecord This is the product that currently exists in the DB.
     * @param currProduct This is the current product we are examining.
     */
    private async addToProductComparison(productRecord, currProduct) {
        // Get the product comparison array from the product that already exists in the DB
        const productComparison = productRecord.productComparison;
        // See if the product current exists in the product comparison array
        const result = productComparison.find(
            (product) =>
                product.productName === currProduct.productName &&
                product.storeName === currProduct.storeName
        );
        // If it doesn't then we need to add it
        if (!result) {
            productRecord.productComparison.push(currProduct);
            await productRecord.save();
        }
        // TODO: If the product does exist in the product comparison array, see if we need to update any of the fields
    }
}
export { ProductProcessor };
