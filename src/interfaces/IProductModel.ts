import Mongoose = require("mongoose");

interface IProductModel extends Mongoose.Document {
    productID: string;
    productName: string;
    storeName: string;
    productPrice: string;
    productLink: string;
    productImage: string;
}

export { IProductModel };
