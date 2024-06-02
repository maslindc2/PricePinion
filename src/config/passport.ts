// config/passport.ts
import {CustomerModel} from "@customer-model";
import { ProductModel } from "@product-model";
import dotenv from "dotenv";

dotenv.config();

const Products = new ProductModel(process.env.MONGODB_URI || "");
const Customer = new CustomerModel(process.env.MONGODB_URI || "", Products);

let passport = require("passport");
let GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const customer = await Customer.findOrCreateGoogleUser(profile);
        console.log("Customer", customer);
        done(null, customer);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, (user as any).id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await Customer.model.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
