const runRenamer = () => { 
//reads txt file
var fs = require('fs');
const { type } = require('os');
// orignal var data = fs.readFileSync('test.txt', 'utf8');
let txtFile = 'test.txt';
var data = fs.readFileSync(txtFile, 'utf8');

//splits string into an array using the " as the break point
//this gives us data on every odd number, every even number is a blank
//we can filter by odds, or by blanks
let importedData = data.split('"');

//filters string data with length less than 2
const sheetData = importedData.filter(sheetIsNotBlank => sheetIsNotBlank.length > 2);

//creates new array by filtering array for projectCode
let projectCode = 'MUM1X0';
const sheetNumbers = sheetData.filter(sheetCheck => sheetCheck.includes(projectCode));

//creates new array with .pdf appended
const newSheetNumbers = sheetNumbers.map(i => i + '.pdf')

//defines an empty array to store the current pdf names in
let pdfNames = [];
//defines the folder to collect cuurent PDF names from 
let renameDirectory = 'C:/Users/Robert Stenning/Desktop/pdf';
//function to get current filenames in renameDirectory
function getCurrentFilenames() {
    console.log("Current filenames:");
    fs.readdirSync(renameDirectory).forEach(file => {
        pdfNames.push(file);
        console.log(file);
    });
  }
getCurrentFilenames();

//while loop to loop through newSheetNumbers vs pdfNames
let i = 0;
let j = 0;
console.log(`start i=${i} & j=${j}`);


//searches newSheetNumbers to see if pdfNames matches, returns true or false
function sheetChecker(){ 
    if (newSheetNumbers[i].includes(pdfNames[j])) {
    sheetMatch = true;
    console.log(sheetMatch)
    console.log(`because ${newSheetNumbers[i]} and ${pdfNames[j]} are a match`)
    fs.renameSync(`${renameDirectory}/${pdfNames[j]}`, `${renameDirectory}/${newSheetNumbers[i]}`);
    console.log(`i=${i} & j=${j}`);
    i = 0;
    sheetSwapper();

       
} else {
    if (i < newSheetNumbers.length && j < pdfNames.length){
        sheetMatch = false;
        console.log(sheetMatch)
        console.log(`because ${newSheetNumbers[i]} and ${pdfNames[j]} are NOT match`)
        i++;
        console.log(`sheet checker false i = ${i} & j = ${j}`)
        sheetChecker();
    }
    };
};

function sheetSwapper(){
    if (i < newSheetNumbers.length){
        console.log(`sheet swapper ran i=${i} & j=${j}`);
        j++;
        sheetChecker()
    }
};

sheetChecker();
if (i < newSheetNumbers.length &&  j < pdfNames.length){
    console.log(`sheet checker ran i = ${i} & j = ${j}`)
    i++;
    sheetChecker();
} else {
    console.log('Sheets RENAMED!')
    getCurrentFilenames();
};
};

exports.runRenamer = runRenamer;

//runRenamer();

/*
<<<<<<<<<< ALL CODE ABOVE FOR PROGRAM, BELOW THIS LINE IS SNIPPETS >>>>>>>>>>>>
*/