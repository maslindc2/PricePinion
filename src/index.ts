/**
 * This is the main file for our Node Server.
 * The current code below is just a demo of how the webscraping works.
 * Fred Meyer is the first grocery store to scrape and that code will be on the branch fred-meyer-dev
 */
// Importing axios and it's response type (welcome to typescript you need a type for everything)
import axios, { AxiosResponse } from "axios";
// We use cheerio to handle manipulating HTML and XHTML
import cheerio from "cheerio";

// This is the F1 2024 driver results
const url = "https://www.formula1.com/en/results.html/2024/drivers.html";

// We need to define an interface for the data we are going to store
interface driverData {
    position: number;
    driver: string;
    car: string;
}

// Call axios to get the HTML file from the url, then once we have it store it to res with type AxiosResponse
axios
    .get(url)
    .then((res: AxiosResponse) => {
        // Store the response data
        const html = res.data;
        // Pass the html data to cheerio
        const $ = cheerio.load(html);
        // Tell cheerio we want the information located in the .resultsarchive-table class then any info in the table body and finally the table row.
        const rankingTableRows = $(".resultsarchive-table > tbody > tr");
        // Using our interface for storing rankings later on
        const rankings: driverData[] = [];

        // Iterate through the information captured by cheerio after targeting the class, tablebody, tablerow
        rankingTableRows.each((i: number, elem: object) => {
            // Find and store the element that contains the position number
            const position: number = parseInt(
                $(elem)
                    .find(`tr:nth-child(${i + 1}) > td:nth-child(2)`)
                    .text()
            );
            // Find and store the drivers first name
            const firstName: string = $(elem)
                .find(
                    `tr:nth-child(${i + 1}) > td:nth-child(3) .hide-for-tablet`
                )
                .text()
                .trim();
            // Find and store the drivers last name
            const lastName: string = $(elem)
                .find(
                    `tr:nth-child(${i + 1}) > td:nth-child(3) .hide-for-mobile`
                )
                .text()
                .trim();
            // Concatenate the first name and last name because F1 split the driver names into two different span tags
            const driver = firstName + " " + lastName;
            // Find and store the race car information
            const car: string = $(elem)
                .find(`tr:nth-child(${i + 1}) > td:nth-child(5)`)
                .text()
                .trim();
            // Push the information we collected to the rankings array
            rankings.push({
                position,
                driver,
                car,
            });
        });
        // Finally print the information we captured
        console.log(rankings);
    })
    .catch(console.error);
