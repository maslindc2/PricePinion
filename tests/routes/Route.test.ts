import chai, { assert, expect } from 'chai';
import chaiHTTP from 'chai-http';
import 'mocha';

chai.use(chaiHTTP);

describe('Get All Products', () => {
    let response: ChaiHttp.Response;

    before((done) => {
        chai.request("http://localhost:8080")
            .get("/api/products")
            .end((error, res) => {
                response = res;
                expect(res).to.have.status(200);
                done();
        });
    });

    it('Should successfully return an populated array', () => {
        // Expect the response to be successful 
        expect(response).to.have.status(200);
        // Expect the response.body to be an instance of Array as we get a JSON Array as a response
        expect(response.body).to.be.instanceof(Array);
        // Expect the JSON Array to contain something 
        expect(response.body).to.have.length.greaterThan(0);
        expect(response).to.have.headers;
    });

    it('Product array should consist of Object with required properties', () => {
        expect(response.body).to.satisfy((products: any[]) => {
            for (let i = 0; i < products.length; i++) {
                // Since each index contains a product object we expect it to be of type Object 
                expect(products[i]).to.be.instanceOf(Object);
                // Expect the current product to have the property productID
                expect(products[i]).to.have.property('productID');
                // Expect the productID to not be empty
                expect(products[i].productID).to.not.equal("");
                
                // Expect the current product to have the property productName
                expect(products[i]).to.have.property('productName');
                // Expect the productName to not be an empty string
                expect(products[i].productName).to.not.equal("");
                
                // Expect the current product to have the property storeName
                expect(products[i]).to.have.property('storeName');
                // Expect the storeName to not be an empty string
                expect(products[i].storeName).to.not.equal("");

                // Expect the current product to have the property productPrice
                expect(products[i]).to.have.property('productPrice');
                // Expect the productPrice to not be an empty string
                expect(products[i].productPrice).to.not.equal("");

                // Expect the current product to have the property productLink
                expect(products[i]).to.have.property('productLink');
                // Expect the productLink to not be an empty string
                expect(products[i].productLink).to.not.equal("");

                // Expect the current product to have the property productImage
                expect(products[i]).to.have.property('productImage');
                // Expect the productImage to not be an empty string
                expect(products[i].productImage).to.not.equal("");
                
                // Expect the current product to have the property productComparison
                expect(products[i]).to.have.property('productComparison').that.is.instanceOf(Array);
            }
            return true;
        });
    });
});

describe('Get a Single Product', function() {
    let productId: string;
    let requestResult: any;
    let response: ChaiHttp.Response;
    // Setting a variable to contain the productID of a specific item we want to fetch
    // Note this can be swapped out to various ID's in the db's test set of data.
    const productID = "24056546f101cca7046cf45d444fc632";
    before(function(done) {
        chai.request("http://localhost:8080")
            .get(`/api/product/${productID}`)
            .end((error, res) => {
                expect(res).to.have.status(200);
            });
    });
});
