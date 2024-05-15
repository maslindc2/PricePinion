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
        // If the customer removes this comparison later on we delete the record from save for later array.
        const productRecord = await this.Products.model
            .findOne({ productID: productID })
            .select("-_id -__v");

        // Build the query for finding the customer we want to save the product comparison to
        const customerRecord = await this.model.findOne({
            customerName: "Customer Name",
        });
        try {
            // Execute the product query and store the productRecord
            // Check if the product comparison already exists in save for later.
            if (this.isProductComparisonInSFL(productRecord, customerRecord)) {
                res.status(409).json({
                    message:
                        "Product Comparison Already Exists In Customer's Save For Later!",
                });
            } else {
                // If the product does not exist in the customer's SFL array, push it to the SFL array
                customerRecord.saveForLater.push(productRecord);
                // Save the updated customer record to the DB
                await customerRecord.save();
                // Send response back
                res.status(201).json({
                    message: "Product Comparison Added Successfully.",
                });
            }
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }
    private isProductComparisonInSFL(
        productRecord: any,
        customerRecord: any
    ): boolean {
        // Find the product record that matches the productID in the customer's SFL array
        const object = customerRecord.saveForLater.find(
            (productComparisonInSFL) =>
                productComparisonInSFL?.productID === productRecord.productID
        );
        // If it returns an object then we have the comparison already saved.
        if (object) {
            return true;
        } else {
            // If it doesn't return an object, then we don't have the comparison already saved.
            return false;
        }
    }
    public async retrieveSaveForLater(res) {
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
    public async deleteAllProductsFromSFL(req, res) {
        // This query is used to retrieve the customer model
        const query = this.model.findOne({ customerName: "Customer Name" });
        try {
            // Executes the customer record query
            const customerRecord = await query.exec();
            // Reassigns the save for later array to an empty array
            customerRecord.saveForLater = [];
            // Saves the customer record to the DB
            await customerRecord.save();
            // Sends a response stating that the operation was successful.
            res.status(200).json({
                message:
                    "All Product Comparisons in Save For Later were Removed!",
            });
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }

    public async deleteOneProductFromSFL(res, productID) {
        // This query is used to retrieve the customer model
        const query = this.model.findOne({ customerName: "Customer Name" });
        try {
            // Executes the customer record query
            const customerRecord = await query.exec();
            // Filter out the product that matches the request productID and overwrite the save for later array.
            customerRecord.saveForLater = customerRecord.saveForLater.filter(
                (productComparisonInSFL) =>
                    productComparisonInSFL.productID !== productID
            );
            // Saves the customer record to the DB
            await customerRecord.save();
            // Sends a response stating that the operation was successful.
            res.status(200).json({
                message:
                    "The Specific Product Comparisons has been removed from customer's save for later!",
            });
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }
}
export { CustomerModel };
