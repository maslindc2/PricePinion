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
                productID: String,
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
    public async retrieveAllProducts(response: any){
        const query = this.model.find({});
        try {
            const products = await query.exec();
            response.json(products);
        } catch (error) {
            logger.error(error);
        }
    }
    // Retireves only a specific product that matches the product id from the database
    public async retrieveProductByID(response: any, id: any){
        // Find a product in the db that matches the request
        const query = this.model.findOne({productID: id});
        try {
            const products = await query.exec();
            response.json(products);
        } catch (error) {
            logger.error(error);
        }
    }

    /** Below are queries used for the ProductProcessor */

    // This query is used for getting a product record from the DB
    // If it exists product processor will either add a product to the productComparison array
    // or update it.  If the product record does not exist it will return null
    public async retireveProductByName(productName: string) {
        const query = this.model.findOne({ productName: productName });
        try {
            const productRecord = await query.exec();
            return productRecord;
        } catch (error) {
            logger.error(error);
            return false;
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
