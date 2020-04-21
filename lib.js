const path = require("path");

const { Octokit } = require("@octokit/rest");

// Load any ENV vars declared in a local .env file.
require("dotenv").config();

const gh = new Octokit({
  auth: process.env.GH_API_KEY,
  baseUrl: "https://api.github.com",
});

module.exports = {
  getGist,
  getGistRevision,
  filterMarkdownFiles
};

async function getGist(gist_id) {
  return gh.gists
    .get({
      gist_id,
    })
    .then((res) => res.data);
}

async function getGistRevision(gist_id, sha) {
  return gh.gists
    .getRevision({
      gist_id,
      sha,
    })
    .then((res) => res.data);
}

function filterMarkdownFiles(files, ext = [".md"]) {
  return Object.values(files).filter((f) => {
    const extname = path.extname(f.filename);
    return ext.includes(extname);
  });
}
