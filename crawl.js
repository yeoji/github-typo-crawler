const fs = require('fs');
const axios = require('axios');
const {execSync} = require('child_process');
const {processResults} = require('./processResults');

const proofreaderInput = 'proofreader.txt';
const repo = process.argv[2];


const getRepoTree = async () => {
    const response = await axios.get(`https://api.github.com/repos/${repo}/git/trees/master`);
    return response.data.tree;
};

const listHtmlAndMdFiles = async () => {
    const filesList = await getRepoTree();
    return filesList
        .filter(fileData => (fileData.path.endsWith('.md') || fileData.path.endsWith('.html')) && !fileData.path.endsWith("CHANGELOG.md"))
        .map(f => f.path);
};

const runProofreader = (files) => {
    files.forEach(file => fs.appendFileSync(proofreaderInput, file + '\n'));
    execSync('yarn proofreader');
};

if (process.argv.length < 3) {
    console.log('Please specify a GitHub repo to crawl (eg. yeoji/github-typo-crawler)');
    process.exit(1);
}

if (fs.existsSync(proofreaderInput)) {
    fs.unlinkSync(proofreaderInput);
}
listHtmlAndMdFiles().then(files => {
    runProofreader(files);
    processResults();
});
