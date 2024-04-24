import { logger } from "@logger";
import express from "express";
import { WebScraperController } from "./WebScraping/WebScraperController";
// Creates and configures an ExpressJS web server.
class App {
    // ref to Express instance
    public expressApp: express.Application;
    //TODO: Product model ref gets set here

    //Run configuration methods on the Express instance.
    constructor(mongoDBConnection: string) {
        this.expressApp = express();
        this.middleware();
        this.routes();
        logger.info(mongoDBConnection);
        this.scrapeAllStores();
        //this.Lists = new ProductModel(mongoDBConnection);
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
    private async scrapeAllStores() {
        logger.info("Starting Scrape Jobs!");
        const scraperContoller = new WebScraperController();
        const results = await scraperContoller.runWebScrapers();
        scraperContoller.resultToJSON(results);
    }
}
export { App };
