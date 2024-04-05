import { expect } from "chai";
import { describe, it } from "mocha";
import { createBrowserInstance } from "@scraper-utils";

// The below test creates a browser instance 
describe("createBrowserInstance", () => {
    it("creates a headless browser that has a headless agent", async () => {
        // Creates a browser instance with headless set to true
        const browser = await createBrowserInstance(true);
        // Expect the browser isntance to exist
        expect(browser).to.exist;
        // Check that the constructur name is CdpBrowser which is the type used for StealthPlugin
        expect(browser.constructor.name).to.equal("CdpBrowser");
        // Get the browser agent
        const browserConfig = await browser.userAgent();
        // Check that it doesn't include headless, if it does that means StealthPlugin failed to set the user agent
        expect(browserConfig).to.include("Headless");
        // Close the browser instance
        await browser.close();
    });
});
