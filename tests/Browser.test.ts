import { expect } from "chai";
import { describe, it } from "mocha";
import { createBrowserInstance } from "../src/WebScraping/Utils/ScraperUtils";

describe("createBrowserInstance", () => {
    it("should return a valid browser instance", async () => {
        const browser = await createBrowserInstance();
        expect(browser).to.exist;
        expect(browser.constructor.name).to.equal("CdpBrowser");
        await browser.close();
    });
});
