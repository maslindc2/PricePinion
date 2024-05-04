import * as Mongoose from "mongoose";
import { IProductModel } from "../interfaces/IProductModel";
import { logger } from "@logger";

class ProductModel {
    public schema: any;
    public model: any;
    public dbConnectionString: string;

    public constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new Mongoose.Schema(
            {
                productID: {
                    type: String,
                    index: true,
                },
                productName: String,
                storeName: String,
                productPrice: String,
                productLink: String,
                productImage: String,
                productComparison: Array,
            },
            { collection: "products" }
        );
    }
    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<IProductModel>("Products", this.schema);
        } catch (error) {
            logger.error(error);
        }
    }

    /** Below are queries used for the Frontend */

    // Retrieves all products in the database
    public async retrieveAllProducts(res: any) {
        // Find all products in the DB, since this is an API endpoint omit the default MongoDB _id field
        // and the default versioning field from the response.
        const query = this.model.find({}).select("-_id -__v");
        try {
            // Execute the query and store the results to products
            const products = await query.exec();
            // Return the products response as JSON.
            res.json(products);
        } catch (error) {
            logger.error(error);
        }
    }
    // Retrieves only a specific product that matches the product id from the database
    public async retrieveProductByID(res: any, productID: any) {
        // Find a product in the db that matches the request,
        // since this is an API endpoint omit the default MongoDB _id field and the default versioning field from the response.
        const query = this.model
            .findOne({ productID: productID })
            .select("-_id -__v");

        try {
            const products = await query.exec();
            res.json(products);
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }

    /** Below are queries used for the ProductProcessor */

    // This query is used for getting a product record from the DB
    // If it exists product processor will either add a product to the productComparison array
    // or update it.  If the product record does not exist it will return null
    public async retrieveProductByName(productName: string) {
        const query = this.model.findOne({ productName: productName });
        try {
            const productRecord = await query.exec();
            return productRecord;
        } catch (error) {
            logger.error(error);
        }
    }
    // This query is used for checking if a specific product and store is located in the DB
    // If it is, then we update that product, if it isn't then ProductProcessor will add the current product
    // to the productComparison array.
    public async checkIfProductExistsAtCurrStore(
        productName: string,
        storeName: string
    ) {
        const query = this.model.findOne({
            productName: productName,
            storeName: storeName,
        });
        try {
            const productRecord = await query.exec();
            if (productRecord) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            logger.error(error);
            return false;
        }
    }
}
export { ProductModel };
