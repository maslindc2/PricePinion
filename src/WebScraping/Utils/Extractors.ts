/**
 * Here we export all the various information extractors we will use for the various websites.
 * Consits of Product Image, Product link extractor, and AriaLabel extractors.
 */
import { ElementHandle } from "puppeteer";

class Extractors {
    /**
     * This function is responsible for extracting the product image
     * @param product This is the individual product cell
     * @param classStructure This is the class structure of the element we wish to extract.
     * @returns The image tag's source value. We'll save the image in the future. Returns null if the element wasn't found.
     */
    public async extractProductImage(
        product: ElementHandle,
        classStructure: string
    ) {
        const productImage = await product.$(classStructure);
        if (productImage) {
            return productImage.evaluate((element) =>
                element.getAttribute("src")
            );
        } else {
            return null;
        }
    }
    /**
     * This function is responsible for extracting the current product's URL.
     * @param product This is the individual product cell
     * @param classStructure This is the class structure of the element we wish to extract.
     * @returns The product's URL. Returns null if the element wasn't found.
     */
    public async extractProductURL(
        baseURL: string,
        product: ElementHandle,
        classStructure: string
    ) {
        const productURL = await product.$(classStructure);
        if (productURL) {
            const productHREF = await productURL.evaluate((element) =>
                element.getAttribute("href")
            );
            return baseURL + productHREF;
        } else {
            return null;
        }
    }
    /**
     * This function is resonsible for extracting information from a Tag's AriaLabel.
     * AriaLabel's contain product names and prices on Kroger sites so we can reuse this function for both.
     * @param product This is the individual product cell
     * @param classStructure This is the class structure of the element we wish to extract.
     * @returns The aria label for an element. Returns null if the element wasn't found
     */
    public async extractFromAria(
        product: ElementHandle,
        classStructure: string
    ) {
        const productElement = await product.$(classStructure);
        if (productElement) {
            return productElement.evaluate((element) => element.ariaLabel);
        } else {
            return null;
        }
    }
    /**
     * This function is resonsible for extracting information from a Tag's text content (a.k.a the part between the open tag and closed tag).
     * For some sites prices and product names are shown between tag's. The reason we can't do this for Kroger is they shove other tags into it
     * which causes issues with extacting information.
     * @param product This is the individual product cell
     * @param classStructure This is the class structure of the element we wish to extract.
     * @returns The text conent from an element. Returns null if the element wasn't found
     */
    public async extractTextContent(
        product: ElementHandle,
        classStructure: string
    ) {
        const productElement = await product.$(classStructure);
        if (productElement) {
            return productElement.evaluate((element) => element.textContent);
        } else {
            return null;
        }
    }
    /**
     * This function is resonsible for extracting information from a tag's data attribute.
     * For some sites prices and product names are stored in the data attribute.
     * @param product This is the individual product cell
     * @param classStructure This is the class structure of the element we wish to extract.
     * @returns The tag value from an element. Returns null if the element wasn't found
     */
    public async extractFromValue(
        product: ElementHandle,
        classStructure: string
    ) {
        const productElement = await product.$(classStructure);
        if (productElement) {
            return productElement.evaluate((element) =>
                element.getAttribute("value")
            );
        } else {
            return null;
        }
    }
}
export { Extractors };
