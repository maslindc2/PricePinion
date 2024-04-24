import Mongoose = require("mongoose");

interface IProductModel extends Mongoose.Document {
    productID: string;
    productName: string;
    productStore: string;
    productPrice: string;
    productURL: string;
}

export { IProductModel };
