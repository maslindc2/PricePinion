import * as Mongoose from "mongoose";
import { ICustomerModel } from "../interfaces/ICustomerModel";
import { logger } from "@logger";
import crypto from "crypto";

class CustomerModel {
    public schema: any;
    public model: any;
    public dbConnectionString: string;

    public constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        // Creating the model and then purely for DEV PURPOSES
        // we create a customer
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

    public async createCustomer(){
        // Check if the customer model already exists in the DB
        const query = this.model.findOne({customerName: "Customer Name"});
        const customerRecord = await query.exec();
        // If the customer record does not exist then create it
        if(!customerRecord){
            await this.model.create({
                customerName: "Customer Name",
                customerEmail: "customer@customer.com"
            });
        }
        
    }
    public async saveComparisonForLater(req, res){
        const query = this.model.findOne({customerName: "Customer Name"});
        const comparison = req.body.comparison;
        try {
            const customerRecord = await query.exec();
            console.log(comparison);
            customerRecord.saveForLater.push(comparison);
            await customerRecord.save();
            res.sendStatus(204);
        } catch (error) {
            logger.error(error);
        }
    }
    public async retireveSaveForLater(res) {
        const query = this.model.find({});
        try {
            const customerRecord = await query.exec();
            res.json(customerRecord);
        } catch (error) {
            logger.error(error);
        }
    }
}
export { CustomerModel };
