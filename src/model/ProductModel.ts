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
                productStore: String,
                productPrice: String,
                productURL: String,
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
    // Querires go below here
}
export { ProductModel };
