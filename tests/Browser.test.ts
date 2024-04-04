import { expect } from "chai";
import { describe, it } from "mocha";
import { createBrowserInstance } from "@scraper-utils";

describe("createBrowserInstance", () => {
    it("creates a valid browser instance", async () => {
        const browser = await createBrowserInstance(true);
        expect(browser).to.exist;
        expect(browser.constructor.name).to.equal("CdpBrowser");
        await browser.close();
    });
});
