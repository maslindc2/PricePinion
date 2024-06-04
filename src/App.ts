import { logger } from "@logger";
import express from "express";
import { WebScraperController } from "./WebScraping/WebScraperController";
import { ProductProcessor } from "./WebScraping/ProductProcessor";
import { ProductModel } from "@product-model";
import { CustomerModel } from "@customer-model";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

// Load environment variables from .env file
dotenv.config();

// Import Passport configuration
import "./config/passport";

// Creates and configures an ExpressJS web server.
class App {
    // ref to Express instance
    public expressApp: express.Application;
    public Products: ProductModel;
    public Customer: CustomerModel;

    // Run configuration methods on the Express instance.
    constructor(mongoDBConnection: string) {
        console.log("MongoDB Connection String: ", mongoDBConnection);
        this.expressApp = express();
        this.middleware(mongoDBConnection);
        this.routes();
        this.Products = new ProductModel(mongoDBConnection);
        this.Customer = new CustomerModel(mongoDBConnection, this.Products);
        // Uncomment this to populate the DB
        // this.scrapeAllStores();
    }

    // Configure the express middleware
    private middleware(mongoDBConnection: string): void {
        // Express bundles include bodyParser by default no longer needed as a separate library
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended: false }));

        

        // Setting allowed headers for the Express server
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
        // Session setup
        this.expressApp.use(session({
            secret: process.env.SESSION_SECRET || "default_secret",
            resave: false,
            saveUninitialized: false,
            store: MongoStore.create({ mongoUrl: mongoDBConnection })
        }));

        // Initialize Passport
        this.expressApp.use(passport.initialize());
        this.expressApp.use(passport.session());

        // Serve static files from the Angular app
        this.expressApp.use(
            express.static(path.join(__dirname, "../../angularDist"))
        );
    }

    // Middleware to ensure the user is authenticated
    private ensureAuthenticated(req: any, res: any, next: any) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ message: 'Unauthorized' });
    }

    // Defining the routes use for PricePinion's Express server
    private routes(): void {
        const router = express.Router();

        router.get("/api/products", async (req, res) => {
            // Retrieve all products from the DB
            await this.Products.retrieveAllProducts(res);
        });

        router.get("/api/save-for-later", this.ensureAuthenticated, async (req, res) => {
            await this.Customer.retrieveSaveForLater(req, res);
        });

        router.post("/api/customer/save-for-later", this.ensureAuthenticated, async (req, res) => {
            await this.Customer.saveComparisonForLater(req, res);
        });

        router.delete(
            "/api/customer/delete-all-products-from-sfl",
            this.ensureAuthenticated,
            async (req, res) => {
                await this.Customer.deleteAllProductsFromSFL(req, res);
            }
        );

        router.delete(
            "/api/customer/delete-one-product-from-sfl/:productID",
            this.ensureAuthenticated,
            async (req, res) => {
                await this.Customer.deleteOneProductFromSFL(req, res);
            }
        );

        router.get("/api/product/:productID", async (req, res) => {
            const productID = req.params.productID;
            await this.Products.retrieveProductByID(res, productID);
        });

        // Authentication routes
        router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        router.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/' }),
            (req, res) => {
                res.redirect('https://pricepinion.azurewebsites.net/'); // Redirect to your Angular dashboard
            }
        );
        
        router.get('/auth/logout', (req, res, next) => {
            req.logout((err) => {
                if (err) { return next(err); }
                req.session.destroy((err) => {
                    if (err) {
                        return res.status(500).send('Failed to logout');
                    }
                    res.clearCookie('connect.sid');
                    res.redirect('https://pricepinion.azurewebsites.net/'); // Redirect to your Angular homepage
                });
            });
        });
        
        router.get('/auth/user', (req, res) => {
            if (req.isAuthenticated()) {
                res.json(req.user);
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        });

        this.expressApp.use("/", router);

        // Catch-all route to serve Angular's index.html
        this.expressApp.get("*", (req, res) => {
            res.sendFile(
                path.join(__dirname, "../../angularDist", "index.html")
            );
        });
    }

    // Scrape store function starts the webscraper
    private async scrapeAllStores() {
        logger.info("Starting Scrape Jobs!");
        const scraperController = new WebScraperController();
        const scrapeResults = await scraperController.runWebScrapers();
        const productProcessor = new ProductProcessor(this.Products);
        await productProcessor.processScrapeResults(scrapeResults);
    }
}
export { App };
