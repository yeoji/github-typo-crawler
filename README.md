## GitHub Typo Crawler

This is a simple Node.js script that will crawl through a GitHub repo, checking for any spelling errors/typos.

It only analyzes `.html` and `.md` files.

This project uses [yeoji/Proofreader](https://github.com/yeoji/Proofreader) which is forked from [kdzwinel/Proofreader](https://github.com/kdzwinel/Proofreader).

# Ignored files

You can define files to ignore in a file tree by appending it into the `ignoredfiles.txt` file. The filename provided must be the exact match of the file to be excluded from checking.

For your convenience, `CHANGELOG.md` is ignored by default (as specified in the file).

### Requirements

```
node v8
```

### Usage

1. Clone the repository

```
git clone git@github.com:yeoji/github-typo-crawler.git
```

2. Install dependencies

```
yarn install
```

3. Run crawler on GitHub repo

```
# REPO is in the format username/repo (eg. yeoji/github-typo-crawler)
yarn crawl <REPO>
```

### Custom Ignored Words

Because adding custom dictionaries did not work on [kdzwinel/Proofreader](https://github.com/kdzwinel/Proofreader), I have added a post-processor.

To add your own words to the list of words to ignore in spellchecks, create a new file under `dictionaries` and start building your list (separated by a newline).

The words will be picked up and filtered out from the final result.
