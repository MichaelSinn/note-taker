const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = 3001;

const app = express();
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname,"/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.json("Get request received");

});

app.post("/api/notes", (req, res) => {
    res.json("Post request received");
});

app.listen(PORT, ()=>{
    console.log(`Started server on http://localhost:${PORT}`);
})