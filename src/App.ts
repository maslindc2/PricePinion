import fs from "fs";
import { logger } from "@logger";
import express from "express";
import { WebScraperController } from "./WebScraping/WebScraperController";
import { ProductModel } from "@product-model";
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
        this.scrapeAllStores();
        //this.updateProducts();
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
            "ScrapeResults/FredMeyer_Scrape_Results.json",
            { encoding: "utf8", flag: "r" }
        );
        const wholeFoodsScrapeResult = fs.readFileSync(
            "ScrapeResults/FredMeyer_Scrape_Results.json",
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
    }
}
export { App };
