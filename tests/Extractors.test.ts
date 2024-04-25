import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { Extractors } from "@scraper-extractors";
import { ElementHandle } from "puppeteer";
import { BrowserInstance } from "@create-browser-instance";
import sinon from "sinon";

describe("Extract product url from a link", () => {
    let browserInstanceObj;
    let extractorsObj;
    beforeEach(() => {
        browserInstanceObj = new BrowserInstance();
        extractorsObj = new Extractors();
    });
    // Before we extract a product url we must create a fake Element Tag for the extractProductURL function to be tested
    it("extracts product url from link returns fred meyer base url + product url", async () => {
        const browserInstance =
            await browserInstanceObj.createBrowserInstance(true);
        const page = await browserInstance.newPage();
        await page.goto("about:blank");
        // Creates a fake link element we can then use to extract details from
        const fakeLink = await page.evaluateHandle(() => {
            const linkElement = document.createElement("a");
            linkElement.className = "kds-link";
            linkElement.href = "/p/fake-product";
            return linkElement;
        });

        // Creates a fake product that we can use to return our fake link element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // When the query function is called return our fake link element
        productStub.$.returns(Promise.resolve(fakeLink));
        // extracts the url from the link
        const fakeProductURL = await extractorsObj.extractProductURL(
            "https://fredmeyer.com",
            productStub,
            ".kds-Link"
        );

        // Close the browser instance as we have extracted the href from the productStub we provided.
        await browserInstance.close();
        // Expect the extracted url to contian our base url and our fake product href from our fake link we made earlier.
        expect(fakeProductURL).to.equal("https://fredmeyer.com/p/fake-product");
    });
    it("fails to locate product returns null", async () => {
        // Creates a fake product that we can use to return our fake link element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // Resolve the query function as null to simulate that we failed to find a product tag
        productStub.$.returns(Promise.resolve(null));
        // Call the product URL extractor with our fake stub
        const result = await extractorsObj.extractProductURL(
            "http://fake-base-url.com",
            productStub,
            "non-existent-class"
        );
        // expect that the result is null
        expect(result).to.equal(null);
    });
});

describe("Extract product name from an aria label", () => {
    let browserInstanceObj;
    let extractorsObj;
    beforeEach(() => {
        browserInstanceObj = new BrowserInstance();
        extractorsObj = new Extractors();
    });

    // Before we extract a product url we must create a fake link Tag for the extractProductURL function to be tested
    it("extracts product name from link returns fred meyer base url + product url", async () => {
        const browserInstance =
            await browserInstanceObj.createBrowserInstance(true);
        const page = await browserInstance.newPage();
        await page.goto("about:blank");
        // Creates a fake link element we can then use to extract details from
        const fakeLink = await page.evaluateHandle(() => {
            const linkElement = document.createElement("a");
            linkElement.className = "kds-link";
            linkElement.ariaLabel = "Fake Product Name";
            return linkElement;
        });
        // Creates a fake product that we can use to return our fake link element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // When the query function is called return our fake link element
        productStub.$.returns(Promise.resolve(fakeLink));
        // Extracts the aria label from the link
        const fakeProductAriaLabel = await extractorsObj.extractFromAria(
            productStub,
            ".kds-Link"
        );
        // Close the browser instance as we have extracted the aria label from the productStub we provided.
        await browserInstance.close();
        // Expect the extracted aria label to contian our fake product name.
        expect(fakeProductAriaLabel).to.equal("Fake Product Name");
    });
    it("fails to locate product returns null", async () => {
        // Creates a fake product that we can use to return our fake link element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // Resolve the query function as null to simulate that we failed to find a product tag
        productStub.$.returns(Promise.resolve(null));
        // Call the product URL extractor with our fake stub
        const result = await extractorsObj.extractFromAria(
            productStub,
            "non-existent-class"
        );
        // expect that the result is null
        expect(result).to.equal(null);
    });
});

describe("Extract product image from an image tag", () => {
    let browserInstanceObj;
    let extractorsObj;
    beforeEach(() => {
        browserInstanceObj = new BrowserInstance();
        extractorsObj = new Extractors();
    });

    // Before we extract a product url we must create a fake Element Tag for the extractProductURL function to be tested
    it("extracts product image url from image tag", async () => {
        // Create a browser instance and go to a blank page
        // We need a browser instance in order to create a real element tag
        const browserInstance =
            await browserInstanceObj.createBrowserInstance(true);
        const page = await browserInstance.newPage();
        await page.goto("about:blank");

        // Creates a fake link element we can then use to extract details from
        const fakeImageTag = await page.evaluateHandle(() => {
            const linkElement = document.createElement("img");
            linkElement.className = "kds-Image-img";
            linkElement.src =
                "https://www.kroger.com/product/images/fake-product-image";
            return linkElement;
        });

        // Creates a fake product that we can use to return our fake image element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // When the query function is called return our fake image element we return our fakeImageTag
        productStub.$.returns(Promise.resolve(fakeImageTag));
        // extracts the url from the fakeImageTag
        const fakeProductImageSrc = await extractorsObj.extractProductImage(
            productStub,
            ".kds-Image-img"
        );
        // Close the browser instance as we have extracted the href from the productStub we provided.
        await browserInstance.close();

        // Expect the extracted url to contian our fake image url.
        expect(fakeProductImageSrc).to.equal(
            "https://www.kroger.com/product/images/fake-product-image"
        );
    });
    it("fails to locate product returns null", async () => {
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // Resolve the query function as null to simulate that we failed to find a product tag
        productStub.$.returns(Promise.resolve(null));
        // Call the product URL extractor with our fake stub
        const result = await extractorsObj.extractProductImage(
            productStub,
            "non-existent-class"
        );
        // expect that the result is null
        expect(result).to.equal(null);
    });
});

describe("Extract inner text from a span tag", () => {
    let browserInstanceObj;
    let extractorsObj;
    beforeEach(() => {
        browserInstanceObj = new BrowserInstance();
        extractorsObj = new Extractors();
    });
    // Before we extract a tag's inner text we must create a fake Element Tag for the extractTagValue function to be tested
    it("extracts inner text from span tag", async () => {
        // Create a browser instance and go to a blank page
        // We need a browser instance in order to create a real element tag
        const browserInstance =
            await browserInstanceObj.createBrowserInstance(true);
        const page = await browserInstance.newPage();
        await page.goto("about:blank");

        // Creates a fake link element we can then use to extract details from
        const fakeSpanTag = await page.evaluateHandle(() => {
            const spanElement = document.createElement("span");
            spanElement.className = "product-price";
            spanElement.textContent = "$5.99";
            return spanElement;
        });

        // Creates a fake product that we can use to return our fake image element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // When the query function is called return our fake image element we return our fakeImageTag
        productStub.$.returns(Promise.resolve(fakeSpanTag));
        // extracts the url from the fakeImageTag
        const fakeSpanInnerText = await extractorsObj.extractTextContent(
            productStub,
            ".product-price"
        );
        // Close the browser instance as we have extracted the href from the productStub we provided.
        await browserInstance.close();

        // Expect the extracted url to contian our fake image url.
        expect(fakeSpanInnerText).to.equal("$5.99");
    });
    it("fails to locate product returns null", async () => {
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // Resolve the query function as null to simulate that we failed to find a product tag
        productStub.$.returns(Promise.resolve(null));
        // Call the product URL extractor with our fake stub
        const result = await extractorsObj.extractTextContent(
            productStub,
            "non-existent-class"
        );
        // expect that the result is null
        expect(result).to.equal(null);
    });
});

describe("Extract product price from a value attribute", () => {
    let browserInstanceObj;
    let extractorsObj;
    beforeEach(() => {
        browserInstanceObj = new BrowserInstance();
        extractorsObj = new Extractors();
    });
    // Before we extract a product value attribute we must create a fake data Tag for the extractFromValue function to be tested
    it("extracts product price from a value attribute", async () => {
        const browserInstance =
            await browserInstanceObj.createBrowserInstance(true);
        const page = await browserInstance.newPage();
        await page.goto("about:blank");
        // Creates a fake data element we can then use to extract details from
        const fakeDataTag = await page.evaluateHandle(() => {
            const dataElement = document.createElement("data");
            dataElement.className = "kds-price";
            dataElement.value = "5.99";
            return dataElement;
        });
        // Creates a fake product that we can use to return our fake data element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // When the query function is called return our fake data element
        productStub.$.returns(Promise.resolve(fakeDataTag));
        // Extracts the value attribute from the data element
        const fakeDataTagValue = await extractorsObj.extractFromValue(
            productStub,
            ".kds-price"
        );
        // Close the browser instance as we have extracted the value attribute from the productStub we provided.
        await browserInstance.close();
        // Expect the extracted value attribute to contian our fake product price.
        expect(fakeDataTagValue).to.equal("5.99");
    });
    it("fails to locate product returns null", async () => {
        // Creates a fake product that we can use to return our fake link element
        const productStub = sinon.createStubInstance(ElementHandle<Element>);
        // Resolve the query function as null to simulate that we failed to find a product tag
        productStub.$.returns(Promise.resolve(null));
        // Call the product URL extractor with our fake stub
        const result = await extractorsObj.extractFromValue(
            productStub,
            "non-existent-class"
        );
        // expect that the result is null
        expect(result).to.equal(null);
    });
});
