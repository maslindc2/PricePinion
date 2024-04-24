import { productSchema } from "@product-schema";
import fs from "fs";

export const updateProducts = async () => {
    const fredMeyerScrapeResult = fs.readFileSync("ScrapeResults/FredMeyer_Scrape_Results.json", { encoding: 'utf8', flag: 'r' });
    const qfcScrapeResult = fs.readFileSync("ScrapeResults/FredMeyer_Scrape_Results.json", { encoding: 'utf8', flag: 'r' });
    const wholeFoodsScrapeResult = fs.readFileSync("ScrapeResults/FredMeyer_Scrape_Results.json", { encoding: 'utf8', flag: 'r' });
    const FMObject = JSON.parse(fredMeyerScrapeResult);
    const QFCObject = JSON.parse(qfcScrapeResult);
    const wfObject = JSON.parse(wholeFoodsScrapeResult);
    
    for(const department of Object.keys(FMObject)){
        for(const product of FMObject[department]){
            const newProduct = new productSchema({
                productName: product.name,
                productStore: "Fred Meyer",
                productPrice: product.price,
                productURL: product.url
            });
            newProduct.save();
        }
    }
    for(const department of Object.keys(QFCObject)){
        for(const product of QFCObject[department]){
            const newProduct = new productSchema({
                productName: product.name,
                productStore: "QFC",
                productPrice: product.price,
                productURL: product.url
            });
            newProduct.save();
        }
    }
    for(const department of Object.keys(wfObject)){
        for(const product of wfObject[department]){
            const newProduct = new productSchema({
                productName: product.name,
                productStore: "WholeFoods",
                productPrice: product.price,
                productURL: product.url
            });
            newProduct.save();
        }
    }
};
