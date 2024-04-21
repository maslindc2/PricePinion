/**
 * This is the main file for the Node Server.
 * Further functions like handling routes and connections to mongo will be set up here.
 * For now we are just calling the main webscraper controller.
 */
// Importing the web scraper controller from our webscraping directory
//import { webScraperController } from "./WebScraping/WebScraperController";
import express from "express";
import * as dotenv from "dotenv";
import { logger } from "@logger";
dotenv.config();

// Calling the web scraper controller
//webScraperController();

// Defining our app using express
const app = express();

// Definig the port number to use
// Default is port 8080, you can set the env var to a custom port number
const port = parseInt(<string>process.env.PORT) | 8080;

// Express bundles include bodyParser by default no longer needed as a separate library
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Listen for requests and log current status for the server
app.listen(port, () => {
    logger.info(`PricePinion Server Ready! Now listening on port:${port}`);
});
// Base route, currently we return the below text
app.get("/", (req, res) => {
    res.send("Welcome to PricePinion Server!");
});
// Homepage Product route for serving homepage products
app.get("/api/homepage-products", (req, res) => {
    res.send("Homepage product route");
});
// Homepage Product route for serving a specific product
app.get("/api/product/:productname", (req, res) => {
    res.send(`Product Comparison route for: ${req.params.productname}`);
});