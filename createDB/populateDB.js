// Require fs for reading from JSON files that we'll use to populate the DB
const fs = require("fs");

// Read each of the JSON files containing data from mongo
const productsCollectionAsJSON = fs.readFileSync("pricepinion.products.json");


//Parse all the JSON files containing the data we are going to insert
const productsObj = JSON.parse(productsCollectionAsJSON);

// Connect to the local mongodb instance using the admin login
db = connect(`mongodb://admin:pricepinion@localhost:27017/`);

// Get the sibling db (this will create the db if it doesn't exist already)
db = db.getSiblingDB("pricepinion");

// Get (or create if it does not exist) the collections we need
const productsCollection = db.getCollection("products");

/**
 * Clear out each collection.
 * Why do this? Remove stale data, this script will only be used for dev/testing purposes
 * so we populate the Local MongoDB using only fresh data. In the event there is a specific test set of data
 * that needs to be used this will ensure the DB only includes that test set.
 */
productsCollection.deleteMany({});

// Use insert many to insert all of the information
productsCollection.insertMany(productsObj);