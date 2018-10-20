const fs = require('fs');
const clc = require('cli-color');

const ignoredWordsDir = './dictionaries';
const ignoredWords = (item) => {
   var ignoredList = [];
   fs.readdirSync(ignoredWordsDir).forEach(file => {
      ignoredList = ignoredList.concat(fs.readFileSync(ignoredWordsDir + '/' + file).toString().split('\n'));
   });
   return !ignoredList.includes(item.word);
};

const printResults = (allFiles) => {
   allFiles.forEach(function (file) {
      console.log('### Results for ' + file.file + ' ###');
      console.log();

      file.results.forEach(function (result) {
        var writeGood = result.suggestions.writeGood;
        var spelling = result.suggestions.spelling;

        //Printing output
        if (writeGood.length || spelling.length) {
          console.log(clc.red(result.text));

          writeGood.forEach(function (item) {
            console.log(clc.blue.bold(' - ' + item.reason));
          });

          spelling.forEach(function (item) {
            console.log(clc.magenta.bold(' - "' + item.word + '" -> ' + item.suggestions));
          });

          console.log();
        }
      });
   });
};

const process = () => {
   if(fs.existsSync('results.json')) {
      const allResults = require('./results.json');
      allResults.forEach(file => {
         file.results.forEach(result => {
            result.suggestions.spelling = result.suggestions.spelling.filter(ignoredWords);
         });
      });

      printResults(allResults);
   }
};

module.exports = {
   processResults: process
}
