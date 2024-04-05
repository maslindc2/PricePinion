import { expect } from "chai";
import { describe, it } from "mocha";
import { fredMeyerScraper } from "@store-scrapers/FredMeyerScraper";
import { fail } from "assert";
import * as dotenv from "dotenv";

dotenv.config();
describe("Fred Meyer Scraper", async () => {
    it("scrapes all urls for fred meyer and returns 2D array with scraped products", async () => {
        // Runs the Fred Meyer Scraper and stores the scraped products in a 2D array
        const scrapeResutlts = await fredMeyerScraper();
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
