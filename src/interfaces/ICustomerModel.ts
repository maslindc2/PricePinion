import Mongoose = require("mongoose");

interface ICustomerModel extends Mongoose.Document {
    customerID: string;
    customerName: string;
    customerEmail: string;
}

export { ICustomerModel };
