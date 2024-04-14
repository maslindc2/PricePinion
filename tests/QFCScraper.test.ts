import { expect } from "chai";
import { describe, it } from "mocha";
import { qfcScraper } from "@store-scrapers/QFCScraper";
import { fail } from "assert";
import * as dotenv from "dotenv";

dotenv.config();
describe("Test QFC scraper", async () => {
    it("scrapes all urls for QFC, returns 2D array with scraped products (of type ProductInfo), all object valus are strings", async () => {
        // Runs the QFC Scraper and stores the scraped products in a 2D array
        const scrapeResutlts = await qfcScraper();
        expect(scrapeResutlts).to.be.instanceOf(Array);
        expect(scrapeResutlts).to.not.be.empty;

        // Ensure that each index of scrape results is of type ProductInfo
        for (const scrapeResult of scrapeResutlts) {
            if (scrapeResult) {
                // If the scrape result is defined then we
                // check each product key in the scrape result is of type string.
                // If it's null then it failed to extract information from the product
                for (const product of scrapeResult) {
                    expect(product.name).to.be.string;
                    expect(product.price).to.be.string;
                    expect(product.url).to.be.string;
                    expect(product.image).to.be.string;
                }
            } else {
                fail("Scrape Result for a url result is null!");
            }
        }
    });
});
