import fs from "fs";
import { logger } from "@logger";
import express from "express";
import { WebScraperController } from "./WebScraping/WebScraperController";
import { ProductModel } from "@product-model";
import crypto from "crypto";

// Creates and configures an ExpressJS web server.
class App {
    // ref to Express instance
    public expressApp: express.Application;
    public Products: ProductModel;

    //Run configuration methods on the Express instance.
    constructor(mongoDBConnection: string) {
        this.expressApp = express();
        this.middleware();
        this.routes();
        //this.scrapeAllStores();
        this.Products = new ProductModel(mongoDBConnection);
    }

    // Configure the express middleware
    private middleware(): void {
        // Express bundles include bodyParser by default no longer needed as a separate library
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: false }));
        // Setting allowed headers for the Express server
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
            next();
        });
    }
    // Defining the routes use for PricePinion's Express server
    private routes(): void {
        const router = express.Router();
        router.get("/", (req, res) => {
            res.send("Welcome to PricePinion Server!");
            this.updateProducts();
        });
        router.get("/api/products", (req, res) => {
            res.send("Homepage product route");
        });
        router.get("/api/product/:productID", async (req, res) => {
            const id = req.params.productID;
            // Call to product schema goes here
            res.send(`Query single product with id: ${id}`);
        });
        this.expressApp.use("/", router);
    }
    // Scrape store function starts the webscraper
    private async scrapeAllStores() {
        logger.info("Starting Scrape Jobs!");
        // Creating a scraperController object
        const scraperContoller = new WebScraperController();
        // Run the webscraper and store object results
        const results = await scraperContoller.runWebScrapers();
        // Store the results object to JSON
        scraperContoller.resultToJSON(results);
    }
    private async updateProducts() {
        const fredMeyerScrapeResult = fs.readFileSync(
            "ScrapeResults/FredMeyer_Scrape_Results.json",
            { encoding: "utf8", flag: "r" }
        );
        const qfcScrapeResult = fs.readFileSync(
            "ScrapeResults/QFC_Scrape_Results.json",
            { encoding: "utf8", flag: "r" }
        );
        const wholeFoodsScrapeResult = fs.readFileSync(
            "ScrapeResults/WholeFoods_Scrape_Results.json",
            { encoding: "utf8", flag: "r" }
        );
        const FMObject = JSON.parse(fredMeyerScrapeResult);
        const QFCObject = JSON.parse(qfcScrapeResult);
        const wfObject = JSON.parse(wholeFoodsScrapeResult);

        const scrapeResults = {
            FredMeyer: FMObject,
            QFC: QFCObject,
            WholeFoods: wfObject,
        };


        // For each store in the scrape results object
        for (const store in scrapeResults) {
            // Get the current store in the scrape results object
            let currStore = scrapeResults[store];
            // For each department in the current store
            for (const department of Object.keys(currStore)) {
                // Iterate through the products in that department
                for (const product of currStore[department]) {
                    const id = crypto.randomBytes(16).toString("hex");
                    product.productID = id;
                    try {
                        // Check if the product currently exists in the database
                        const doesProductExist = await this.Products.checkIfProductExists(product.productName);
                        // If it does exist in the database
                        if (doesProductExist) {
                            // Check if it's at the current store, if it does we update the product's information
                            const doesProductExistAtCurrStore = await this.Products.checkIfProductExistsAtCurrStore(product.productName, product.storeName);
                            if (doesProductExistAtCurrStore) {
                                console.log("Update the current product's info");
                            } else {
                                // If the product does not exist at the current store we will add it to the product comparison section
                                console.log("Add current product to product comparison");
                            }
                        } else {
                            //The product does not exist AT ALL in the database we create it.
                            try {
                                // Create the product using the current product object
                                await this.Products.model.create(product);
                            } catch (error) {
                                // If the product failed to create log the error
                                logger.error(error);
                            }
                        }
                    } catch (error) {
                        logger.error(`Object creation failed! Error: ${error}`);
                    }
                }
            }
        }
    }
}
export { App };
