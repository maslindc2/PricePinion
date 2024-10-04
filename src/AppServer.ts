// Importing dotenv to use env variables
import * as dotenv from "dotenv";
import { App } from "./App";
import { logger } from "@logger";

dotenv.config();

const mongoURI = process.env.NODE_ENV === 'test'
  ? process.env.MONGODB_TEST_URI // Use our Testing URI if test is set for node ENV
  : process.env.MONGODB_URI;    // Use the production URI if NODE_ENV is not set to test

// Defining the port number to use
// Default is port 8080, you can set the env var to a custom port number
const port = process.env.PORT;
const mongoDBConnection = process.env.MONGODB_URI;

const server = new App(mongoDBConnection).expressApp;
server.listen(port);
// Log what port we are listening on
logger.info(`PricePinion Server Ready! Now listening on port: ${port}`);
