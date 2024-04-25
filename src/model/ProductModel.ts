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
    public async retireveProduct(productName: string) {
        const query = this.model.findOne({ productName: productName });
        try {
            const productRecord = await query.exec();
            return productRecord;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }
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
