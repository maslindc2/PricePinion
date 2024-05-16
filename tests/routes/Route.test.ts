import chai, { assert, expect } from "chai";
import chaiHTTP from "chai-http";
import "mocha";
import { AnyObject } from "mongoose";

chai.use(chaiHTTP);

describe("Get All Products", () => {
    let response: ChaiHttp.Response;
    // Before all tests make a call to our server to get all products and store the response
    before((done) => {
        chai.request("http://localhost:8080")
            .get("/api/products")
            .end((error, res) => {
                response = res;
                expect(res).to.have.status(200);
                done();
            });
    });

    // Check that the response we stored has a populated array
    it("Response should successfully return a populated array", () => {
        // Expect the response to be successful
        expect(response).to.have.status(200);
        // Expect the response.body to be an instance of Array as we get a JSON Array as a response
        expect(response.body).to.be.instanceof(Array);
        // Expect the Array to have a length greater than 0
        expect(response.body).to.have.length.greaterThan(0);
        // Expect the response to have headers
        expect(response).to.have.headers;
    });

    it("Product array should consist of Object with required properties", () => {
        expect(response.body).to.satisfy((products: any[]) => {
            // Iterate through the products array and check that each object satisfies the correct properties
            for (let i = 0; i < products.length; i++) {
                // Since each index contains a product object we expect it to be of type Object
                expect(products[i]).to.be.instanceOf(Object);

                // Expect the current product to have the property productID
                expect(products[i]).to.have.property("productID");
                // Expect the productID to be a string
                expect(products[i].productID).to.be.string;
                // Expect the productID to not be an empty string
                expect(products[i].productID).to.not.equal("");

                // Expect the current product to have the property productName
                expect(products[i]).to.have.property("productName");
                // Expect the productName to be a string
                expect(products[i].productName).to.be.string;
                // Expect the productName to not be an empty string
                expect(products[i].productName).to.not.equal("");

                // Expect the current product to have the property storeName
                expect(products[i]).to.have.property("storeName");
                // Expect the storeName to be a string
                expect(products[i].storeName).to.be.string;
                // Expect the storeName to not be an empty string
                expect(products[i].storeName).to.not.equal("");

                // Expect the current product to have the property productPrice
                expect(products[i]).to.have.property("productPrice");
                // Expect the productPrice to be a string
                expect(products[i].productPrice).to.be.string;
                // Expect the productPrice to not be an empty string
                expect(products[i].productPrice).to.not.equal("");

                // Expect the current product to have the property productLink
                expect(products[i]).to.have.property("productLink");
                // Expect the productLink to be a string
                expect(products[i].productLink).to.be.string;
                // Expect the productLink to not be an empty string
                expect(products[i].productLink).to.not.equal("");

                // Expect the current product to have the property productImage
                expect(products[i]).to.have.property("productImage");
                // Expect the productImage to be a string
                expect(products[i].productImage).to.be.string;
                // Expect the productImage to not be an empty string
                expect(products[i].productImage).to.not.equal("");

                // Expect the current product to have the property productComparison
                expect(products[i])
                    .to.have.property("productComparison")
                    .that.is.instanceOf(Array);
            }
            return true;
        });
    });
});

describe("Get a Single Product", () => {
    let response: ChaiHttp.Response;
    // Setting productID's of specific specific item we want to fetch
    // This is the product id for Roma Tomatoes
    const productID = "fcd850d26cca1a70232123829fbec5ec";

    // Before All tests
    before((done) => {
        // First get the response for a product with comparisons
        chai.request("http://localhost:8080")
            .get(`/api/product/${productID}`)
            .end((error, res) => {
                response = res;
                expect(res).to.have.status(200);
                done();
            });
    });
    // Test that our response we stored was successful and it's an object
    it("Response should successfully return an object for a single product", () => {
        // Expect the response we stored from our BeforeAll to be successful
        expect(response).to.have.status(200);
        // Expect the response.body to be an instance of Object, as we get an Object for a particular product
        expect(response.body).to.be.instanceOf(Object);
        expect(response).to.have.headers;
    });
    // Test for response structure on a unique item
    it("Product array should consist of Object with required properties", () => {
        // Check that the product object contains all the expected properties
        expect(response.body).to.satisfy((product: Object) => {
            // Define the expected properties
            const expectedProperties = [
                "productID",
                "productName",
                "storeName",
                "productPrice",
                "productLink",
                "productImage",
                "productComparison",
            ];
            for (const property in product) {
                // If the object contains a key that was not expected return false as this does not satisfy our requirements
                if (!expectedProperties.includes(property)) {
                    return false;
                }
            }
            // If we are here then the response contains all the expected properties
            return true;
        });
        // Check that all the expected properties are the correct type and are not empty
        expect(response.body).to.satisfy((product: AnyObject) => {
            // Expect the productID to be a string
            expect(product.productID).to.be.string;
            // Expect the productID to NOT be an empty string
            expect(product.productID).to.not.equal("");

            // Expect the productName to be a string
            expect(product.productName).to.be.string;
            // Expect the productName to NOT be an empty string
            expect(product.productName).to.not.equal("");

            // Expect the storeName to be a string
            expect(product.storeName).to.be.string;
            // Expect the storeName to NOT be an empty string
            expect(product.storeName).to.not.equal("");

            // Expect the productPrice to be a string
            expect(product.productPrice).to.be.string;
            // Expect the productPrice to NOT be an empty string
            expect(product.productPrice).to.not.equal("");

            // Expect the productLink to be a string
            expect(product.productLink).to.be.string;
            // Expect the productLink to NOT be an empty string
            expect(product.productLink).to.not.equal("");

            // Expect the productImage to be a string
            expect(product.productImage).to.be.string;
            // Expect the productImage to NOT be an empty string
            expect(product.productImage).to.not.equal("");

            // Expect the productComparison to be a string
            expect(product.productComparison).to.be.instanceOf(Array);
            // Expect the productComparison to NOT be an empty string
            expect(product.productComparison).to.not.equal([]);
            return true;
        });
    });
});
