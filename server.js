const express = require("express");
const { Liquid } = require("liquidjs");

const lib = require("./lib");

const port = process.env.PORT || 3000;

const engine = new Liquid({
  strictFilters: true
});

const app = express();
// Views
app.engine("liquid", engine.express());
app.set("views", "./views"); // specify the views directory
app.set("view engine", "liquid");

// Routes
app.get("/", (req, res) => res.render("base", { name: "Dan" }));
app.get("/:gist_id", async (req, res) => {
  const { gist_id } = req.params;

  const gist = await lib.getGist(gist_id);
  const markdownFiles = lib.filterMarkdownFiles(gist.files);

  res.render("gist", {
    gist_id,
    gist,
    files: markdownFiles,
    history: gist.history.reverse()
  });
});
app.get("/:gist_id/:revision_sha", async (req, res) => {
  const { gist_id, revision_sha } = req.params;

  const $gist = await lib.getGist(gist_id);

  const gist = await lib.getGistRevision(gist_id, revision_sha);
  const markdownFiles = lib.filterMarkdownFiles(gist.files);

  res.render("gist", {
    gist_id,
    revision_sha,
    gist,
    files: markdownFiles,
    history: $gist.history.reverse()
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
