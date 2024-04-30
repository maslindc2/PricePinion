import * as Mongoose from "mongoose";
import { ICustomerModel } from "../interfaces/ICustomerModel";
import { logger } from "@logger";
import crypto from "crypto";
import { ProductModel } from "@product-model";

class CustomerModel {
    public schema: any;
    public model: any;
    public dbConnectionString: string;
    public Products: ProductModel;

    public constructor(DB_CONNECTION_STRING: string, Products: ProductModel) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        // Since we need to store a product to the customer's save for later
        // we need the ProductModel
        this.Products = Products;
        // Creating the Customer model and then purely for DEV PURPOSES
        // we create a customer this will be replaced when we move to SSO
        this.createModel().then(async () => {
            await this.createCustomer();
        });
    }

    public createSchema() {
        this.schema = new Mongoose.Schema(
            {
                customerID: String,
                customerName: String,
                customerEmail: String,
                saveForLater: Array,
            },
            { collection: "customers" }
        );
    }
    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            this.model = Mongoose.model<ICustomerModel>(
                "Customers",
                this.schema
            );
        } catch (error) {
            logger.error(error);
        }
    }

    public async createCustomer() {
        // Check if the customer model already exists in the DB
        const query = this.model.findOne({ customerName: "Customer Name" });
        const customerRecord = await query.exec();
        // If the customer record does not exist then create it
        if (!customerRecord) {
            const id = crypto.randomBytes(16).toString("hex");
            await this.model.create({
                customerID: id,
                customerName: "Customer Name",
                customerEmail: "customer@customer.com",
            });
        }
    }
    public async saveComparisonForLater(req, res) {
        const productID = req.body.productID;
        // Build the query for finding the requested product in the ProductsModel
        // Since this record will be stored to the customer's save for later array remove the _id and __v
        // If the customer remvoes this comparison later on we delete the record from save for later array.
        const productQuery = this.Products.model
            .findOne({ productID: productID })
            .select("-_id -__v");

        // Build the query for finding the customer we want to save the product comparison to
        const customerQuery = this.model.findOne({
            customerName: "Customer Name",
        });
        try {
            // Execute the product query and store the productRecord
            const productRecord = await productQuery.exec();
            // Execute the customer query and store the customerRecord
            const customerRecord = await customerQuery.exec();
            // Push the product comparison to the customer's save for later array
            customerRecord.saveForLater.push(productRecord);
            // Save the updated customer record to the DB
            await customerRecord.save();
            // Send response back
            res.sendStatus(204);
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }
    public async retireveCustomer(res) {
        // Find get the customer's record and since this is an API endpoint remove the _id and __v fields
        const query = this.model
            .findOne({ customerName: "Customer Name" })
            .select("-_id -__v");
        try {
            const customerRecord = await query.exec();
            res.json(customerRecord);
        } catch (error) {
            logger.error(error);
        }
    }
}
export { CustomerModel };
