// Importing dotenv to use env variables
import * as dotenv from "dotenv";
import { App } from "./App";
import { logger } from "@logger";

dotenv.config();

// Defining the port number to use
// Default is port 8080, you can set the env var to a custom port number
const port = process.env.PORT;
const mongoDBConnection = process.env.MONGODB_URI;

const server = new App(mongoDBConnection).expressApp;
server.listen(port);
// Log what port we are listening on
logger.info(`PricePinion Server Ready! Now listening on port: ${port}`);
