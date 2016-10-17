'use strict';

let fs = require('fs');

const INPUT_FILE = process.argv[2] || './test.txt';
const OUTPUT_FILE = './results.txt';

init();

/**
 * Kicks off processing of file
 */
function init() {
    fs.readFile(INPUT_FILE, 'utf8', processEntries);

    /**
     * Read file contents and process entries
     * @param err
     * @param contents
     */
    function processEntries(err, contents) {

        if (err) {
            console.error(err);
            return;
        }

        console.log('Processing input...');

        // Split the file entries into an array
        let lines = contents.toString('utf-8').split("\n");

        // Map through the test sequences and return their contiguous max
        let maxes = lines.slice(1).map((testSequence) => {

            // Split the sequence into an array of integers
            let intSequence = testSequence
                .split(' ')
                .map((strNumber) => {
                    return parseInt(strNumber, 10);
                });

            // Pass array of integers and return contiguous max
            return findGreatestSum(intSequence);
        });

        // Write the results
        writeResults(OUTPUT_FILE, maxes.join('\n'), (err) => {
            if (err) {
                console.error('An error occurred while writing results: ', err);
                return;
            }

            console.log('Results successfully written to ' + OUTPUT_FILE);
        });
    }

    /**
     * Writes data to local file system
     * @param file
     * @param data
     * @param cb
     */
    function writeResults(file, data, cb) {
        console.log('Writing results...');
        fs.writeFile(file, data, cb);
    }

    /**
     * Algorithm for finding largest sum of contiguous integers
     * @param sequence
     * @returns {*}
     */
    function findGreatestSum(sequence) {
        let isAllNegatives = true, // Flag to indicate if all entries are negative
            max = 0, // Tracks max sum of integers in sub-arrays
            sum = 0; // Tracks the sum of sub-arrays

        sequence.forEach((num) => {
            if (num >= 0) {
                isAllNegatives = false; // If the number is non-negative, set flag to false
            }

            sum += num; // Add integer value to current sum
            if (max < sum) {
                max = sum; // If sum is greater than the current max, set max to sum
            } else if (sum < 0) {
                sum = 0; // If sum turns negative, reset it to 0
            }
        });

        if (isAllNegatives) {
            // Use Math.max to return single greatest negative number
            return Math.max.apply(null, sequence);
        }

        return max;
    }
}

