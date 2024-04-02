/**
 * This is the main file for the Node Server.
 * Further functions like handling routes and connections to mongo will be set up here.
 * For now we are just calling the main webscraper controller.
 */
// Importing the web scraper controller from our webscraping directory
import { webScraperController } from "./WebScraping/WebScraperController";

// Calling the web scraper controller
webScraperController();
