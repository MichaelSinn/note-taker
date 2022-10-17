const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid4");

const PORT = 3001;

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname,"/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", (err, data) =>{
        err ? res.json("Error retrieving data") : res.json(JSON.parse(data));
    });
});

app.post("/api/notes", (req, res) => {
    let note = req.body;
    note.id = uuid();
    fs.readFile("./db/db.json", (err, data)=>{
        let currentDb = JSON.parse(data);
        currentDb.push(note);
        let newDb = JSON.stringify(currentDb);
        fs.writeFile("./db/db.json", newDb, (err)=>{
            err ? console.log(err) : console.log("Successfully wrote to file");
        });
    });
    res.json(note);
});

// Delete end point
app.delete("/api/notes/:id", (req, res)=>{
    let id = req.params.id; // Get the id from the parameters
    fs.readFile("./db/db.json", (err, data)=>{
        let currentDb = JSON.parse(data);
        const newDb = currentDb.filter((note)=>!(id === note.id)); // Remove the note with the matching id
        fs.writeFile("./db/db.json", JSON.stringify(newDb), (err)=>{ // Rewrite database
            err ? console.log(err) : console.log(`Successfully deleted note ${id}`); // Check for errors
        });
    });
    res.json("Delete request received");
});

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, ()=>{
    console.log(`Started server on http://localhost:${PORT}`);
});
