/**
 * This is the product schema used for defining products in our database.
 * Consists of the product name, image, and price.
 */
import { randomUUID } from "crypto";
import mongoose from "mongoose";

const product = new mongoose.Schema({
    productID: {
        type: "UUID",
        default: () => randomUUID(),
        required: true,
    },
    productName: {
        type: String,
        required: true
    },
    productStore: {
        type: String,
        required: true
    },
    productPrice: {
        type: String,
        required: true,
    },
    productURL: {
        type: String,
        required: true,
    },
    productComparison: {
        type: Object,
    },
});
export const productSchema = mongoose.model("product", product);
