/** This is the route for a specific Product.
 * This is the information that is fetched from the DB for comparing the price
 * of a product across the different stores
 */
import { productSchema } from "@product-schema";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

/**
 * This function is repsonsible for fetching product information for the individual product comparison pages.
 * @param {*} req Contains the product ID to fetch the description, name, and price from
 * @param {*} res Used for sending the information back to the client
 * @returns The product information as JSON back to the client
 */
export const productRoute = async (
    req: Request<
        { productID: string },
        any,
        any,
        ParsedQs,
        Record<string, any>
    >,
    res: Response<any, Record<string, any>, number>
) => {
    const productFromDB = await productSchema.findById(req.params.productID);
    if (productFromDB) {
        return res.status(200).json(productFromDB);
    } else {
        return res.sendStatus(404);
    }
};
