/**
 * This is the main file for the Node Server.
 * Further functions like handling routes and connections to mongo will be set up here.
 * For now we are just calling the main webscraper controller.
 */
// Importing the web scraper controller from our webscraping directory
import { webScraperController } from "./WebScraping/WebScraperController";
// Improting Libraries needed for PricePinion server
import express from "express";
import cors from "cors";
// Using our winston logger for log levels
import { logger } from "@logger";
// Importing mongoose for our ProductSchema
import mongoose from "mongoose";
// Importing dotenv to use env variables
import * as dotenv from "dotenv";

// Importing the routes required for our server
import { productRoute } from "@product-route";

import { updateProducts } from "./WebScraping/DB/UpdateProducts";
dotenv.config();

//webScraperController();

// Create Mongoose connection to MongoDB.
mongoose
    .connect(<string>process.env.MONGODB_URI, {dbName: "products"})
    .then(() => {
        logger.info("Successfully Connected to MongoDB!");
        updateProducts();
    })
    .catch((error) => {
        logger.error(`MongoDB Failed to Connect! Caused error: ${error}`);
        process.exit(1);
    });


/**
// Defining our app using express
const app = express();

// Definig the port number to use
// Default is port 8080, you can set the env var to a custom port number
const port = parseInt(<string>process.env.PORT) | 8080;

// Express bundles include bodyParser by default no longer needed as a separate library
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Defining cross origin access policy
app.use(
    cors({
        origin: "*",
    })
);



// Listen for requests and log current status for the server
app.listen(port, () => {
    logger.info(`PricePinion Server Ready! Now listening on port:${port}`);
});

// Base route, currently we return the below text
app.get("/", (req, res) => {
    res.send("Welcome to PricePinion Server!");
});
// Homepage Product route for serving homepage products
app.get("/api/products", (req, res) => {
    res.send("Homepage product route");
});
// Homepage Product route for serving a specific product
app.get("/api/product/:productID", (req, res) => {
    productRoute(req, res);
});
 */