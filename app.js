const fs = require("fs");
const express = require("express");
const expressFileUpload = require("express-fileupload");

const app = express();
app.use(expressFileUpload());

const port = 3000;
const uploadedDirectory = __dirname + "/uploaded";
let memory = {};

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/form", (req, res) => {
  if (req.files) {
    const file = req.files.file;
    fs.writeFileSync(uploadedDirectory + "/" + file.name, file.data);
    memory[file.name] = fs.readFileSync(uploadedDirectory + "/" + file.name);
    console.log(memory);
    res.send(
      `To download, go to http://localhost:${port}/uploaded/${file.name}`
    );
  } else {
    res.redirect("/");
  }
});

app.get("/uploaded/:filename", (req, res) => {
  let params = req.params.filename;
  if (memory[params]) {
    res.send(memory[params]);
  } else if (fs.existsSync(uploadedDirectory + "/" + params)) {
    memory[params] = fs.readFileSync(uploadedDirectory + "/" + params);
    res.send(memory[params]);
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
