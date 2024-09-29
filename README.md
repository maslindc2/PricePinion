# PricePinion-Backend

![Web Scraping](https://github.com/PricePinion/Webscraper/actions/workflows/unit_tests.yml/badge.svg)

## Development Instructions

### Getting the packages.

If you have just cloned the repo run the command `npm i` or `npm install`

The package.json contains all the packages required. If you run into any issues file an issue on our [GitHub Issues](https://github.com/PricePinion/PricePinion-Backend/issues) or message Maslin Farrell on Teams.  

### Starting the development server

To work smarter and not harder, we have bundled the tsc compile command and node AppServer.ts into one simple command called: `npm run dev`
Now you no longer have to stress about bugs because you forgot to compile the code. 
We also use tsc-alias for cleaner imports, see the section Formatting for more info.

On the topic of compilation, with some Typescript projects .js.map and .js files are littered throughout the project files. In this project tsc is set to store
these compilation artifacts into a directory called dist.  This folder is git ignored so it won't show up on our GitHub repo.

### All the other commands

  

#### Formatting  

To format the codebase, so it's easier to read (because TS/JS can get pretty ugly) run `npm run format`. When 

##### Tsc Alias
Relative imports can get very ugly with all the directories for modules. When building a class, a rule of thumb to follow is if it's going to be used more than once, make an alias for it.

To make an alias go to the file "tsconfig.json" and under the "paths" key you can specify the alias to associate your class with.
As an example, to import our Winston Logger, we simply type `import { logger } from "@logger";`
this is cleaner than `import { logger } from "./src/utils/WinstonLogger.ts;`

#### Testing

##### Web Scraper Testing
These tests will run when a pull request is made, and they must pass in order to push your changes to main.
To run tests locally execute the command `npm run test` to run tests using Mocha and Chai.
##### Route API Testing
To run tests for routes execute the command `npm run test:routes` to run ONLY the route tests.

