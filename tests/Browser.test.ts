import { expect } from "chai";
import { describe, it } from "mocha";
import { BrowserInstance } from "@create-browser-instance";

// The below test creates a browser instance
describe("createBrowserInstance", () => {
    let browserInstanceObj;
    beforeEach(() => {
        browserInstanceObj = new BrowserInstance();
    });
    it("creates a headless browser that has a headless agent", async () => {
        // Creates a browser instance with headless set to true
        const browser = await browserInstanceObj.createBrowserInstance(true);
        // Expect the browser instance to exist
        expect(browser).to.exist;
        // Check that the constructor name is CdpBrowser which is the type used for StealthPlugin
        expect(browser.constructor.name).to.equal("CdpBrowser");
        // Get the browser agent
        const browserConfig = await browser.userAgent();
        // Check that it doesn't include headless, if it does that means StealthPlugin failed to set the user agent
        expect(browserConfig).to.include("Headless");
        // Close the browser instance
        await browser.close();
    });
});
