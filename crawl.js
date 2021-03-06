const fs = require('fs');
const axios = require('axios');
const {execSync} = require('child_process');
const {processResults} = require('./processResults');

const proofreaderInput = 'proofreader.txt';
const repo = process.argv[2];

const ignoredFiles = function () {
    const data = fs.readFileSync("./ignoredfiles.txt", 'utf8');
    return data.split('\n');
}();

const isFileIgnored = (fileName) => {
    for (const e of ignoredFiles) {
        if (e.length > 0 && fileName.endsWith(e)) {
            return true;
        }
    }
    return false;
};

const getRepoTree = async () => {
    const response = await axios.get(`https://api.github.com/repos/${repo}/git/trees/master`);
    return response.data.tree;
};

const listHtmlAndMdFiles = async () => {
    const filesList = await getRepoTree();
    return filesList
        .filter(fileData => (fileData.path.endsWith('.md') || fileData.path.endsWith('.html')) && !isFileIgnored(fileData.path))
        .map(file => `https://github.com/${repo}/raw/master/` + file.path);
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
    if(files.length > 0) {
        runProofreader(files);
        processResults();
    }
});
