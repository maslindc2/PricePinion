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
        this.Products = Products;
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
                googleId: String, // To store the Google ID
                displayName: String, // To store the display name from Google
                firstName: String, // To store the first name from Google
                lastName: String, // To store the last name from Google
                image: String // To store the profile image URL from Google
            },
            { collection: "customers" }
        );
    }

    public async createModel() {
        try {
            await Mongoose.connect(this.dbConnectionString);
            console.log("Connected to MongoDB", Mongoose.models)
            if (Mongoose.models.Customers) {
                this.model = Mongoose.model<ICustomerModel>("Customers");
            } else {
                this.model = Mongoose.model<ICustomerModel>("Customers", this.schema);
            }
        } catch (error) {
            logger.error(error);
        }
    }

    public async createCustomer() {
        const query = this.model.findOne({ customerName: "Customer Name" });
        const customerRecord = await query.exec();
        if (!customerRecord) {
            const id = crypto.randomBytes(16).toString("hex");
            await this.model.create({
                customerID: id,
                customerName: "Customer Name",
                customerEmail: "customer@customer.com",
            });
        }
    }

    public async findOrCreateGoogleUser(profile) {
        const { id, displayName, name, photos, emails } = profile;
        let customer = await this.model.findOne({ googleId: id });

        if (!customer) {
            customer = new this.model({
                googleId: id,
                displayName,
                firstName: name.givenName,
                lastName: name.familyName,
                image: photos[0].value,
                customerEmail: emails[0].value,
                customerName: `${name.givenName} ${name.familyName}`
            });
            await customer.save();
        }

        return customer;
    }

    public async saveComparisonForLater(req, res) {
        const productID = req.body.productID;
        const productRecord = await this.Products.model
            .findOne({ productID: productID })
            .select("-_id -__v");

        const customerRecord = await this.model.findOne({
            customerName: "Customer Name",
        });
        try {
            if (this.isProductComparisonInSFL(productRecord, customerRecord)) {
                res.status(409).json({
                    message: "Product Comparison Already Exists In Customer's Save For Later!",
                });
            } else {
                customerRecord.saveForLater.push(productRecord);
                await customerRecord.save();
                res.status(201).json({
                    message: "Product Comparison Added Successfully.",
                });
            }
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }

    private isProductComparisonInSFL(productRecord: any, customerRecord: any): boolean {
        const object = customerRecord.saveForLater.find(
            (productComparisonInSFL) =>
                productComparisonInSFL?.productID === productRecord.productID
        );
        return !!object;
    }

    public async retrieveSaveForLater(res) {
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
                message: "All Product Comparisons in Save For Later were Removed!",
            });
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }

    public async deleteOneProductFromSFL(res, productID) {
        const query = this.model.findOne({ customerName: "Customer Name" });
        try {
            const customerRecord = await query.exec();
            customerRecord.saveForLater = customerRecord.saveForLater.filter(
                (productComparisonInSFL) =>
                    productComparisonInSFL.productID !== productID
            );
            await customerRecord.save();
            res.status(200).json({
                message: "The Specific Product Comparison has been removed from customer's save for later!",
            });
        } catch (error) {
            logger.error(error);
            res.sendStatus(500);
        }
    }
}

export { CustomerModel };
