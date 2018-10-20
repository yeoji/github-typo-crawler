const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const { execSync } = require('child_process');
const { processResults } = require('./processResults');

const proofreaderInput = 'proofreader.txt';
const repo = process.argv[2];

const findTreeListUrl = async () => {
   const response = await axios.get(`https://github.com/${repo}/find/master`);
   const $ = cheerio.load(response.data);

   return 'https://github.com' + $('table#tree-finder-results').data('url');
};

const listHtmlAndMdFiles = async () => {
   const treeListUrl = await findTreeListUrl();
   const response = await axios.get(treeListUrl, {
      headers: {
         'Accept': 'application/json',
         'Referer': `https://github.com/${repo}/find/master`
      }
   });

   const filesList = response.data.paths;
   return filesList
      .filter(file => file.endsWith('.md') || file.endsWith('.html'))
      .map(file => `https://github.com/${repo}/raw/master/` + file);
}

const runProofreader = (files) => {
   files.forEach(file => fs.appendFileSync(proofreaderInput, file + '\n'));
   execSync('yarn proofreader');
}

if(process.argv.length < 3) {
   console.log('Please specify a GitHub repo to crawl (eg. sendgrid/docs)');
   process.exit(1);
}

if(fs.existsSync(proofreaderInput)) {
   fs.unlinkSync(proofreaderInput);
}
listHtmlAndMdFiles().then(files => {
   runProofreader(files);
   processResults();
});
