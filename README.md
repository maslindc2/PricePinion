# Web scraper

This repo is for building the web scraper we will need to use for PricePinion.
![Web Scraping](https://github.com/PricePinion/Webscraper/actions/workflows/unit_tests.yml/badge.svg)

## Development Instructions

### Getting the packages.

Just like any JavaScript/Typescript project we need to install all the packages.

If you have just cloned the repo run the command `npm i` or `npm install`
package.json contains all the packages required. If you run into any issues ping Maslin Farrell on Teams.

### Starting the development server

Since Typescript is just translated JavaScript we need to execute the typescript compiler (`tsc`) and then run the translated JavaScript.
We can do this in one simple command `npm run dev`.  This will execute `tsc` to compile the Typescript code, then it calls node dist/index.js to run the program.

### All the other commands

#### Formatting

To improve code quality and readability I have set up ESLint and Prettier. You can run it or just leave it.  I will run these commands before each pull request.

To lint the all the files you can run `npm run lint` This command will go through the codebase and complain about anything that it doesn't like.

To format the codebase, so it's easier to read (because TS/JS can get pretty ugly) run `npm run format`

Once we set up our GitHub Actions I will run ESLint and Prettier each time code is pulled into main, so we don't have to do it each time.

#### Testing

To run tests execute the command `npm run test` to run tests using Mocha and Chai.
