// Add in packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid4");

const PORT = 3001; // Define the port to be used

// Create the express application
const app = express();
// Add in middleware and define static folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// GET /notes end point
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname,"/public/notes.html")); // Send the notes.html file
});

// GET /api/notes end point
app.get("/api/notes", (req, res) => {
    // Read the database and return the parsed data
    fs.readFile("./db/db.json", (err, data) =>{
        err ? res.json("Error retrieving data.") : res.json(JSON.parse(data)); // Either return the data or that there was an error
    });
});

// POST /api/notes end point
app.post("/api/notes", (req, res) => {
    let note = req.body; // Get the note to be added
    note.id = uuid(); // Give it an id
    // Read the database
    fs.readFile("./db/db.json", (err, data)=>{
        let currentDb = JSON.parse(data); // Parse the database
        currentDb.push(note); // Add the note
        let newDb = JSON.stringify(currentDb);
        // Save to the database
        fs.writeFile("./db/db.json", newDb, (err)=>{
            err ? console.log(err) : console.log("Successfully wrote to file.");
        });
    });
    // Return the note that was to be added
    res.json(note);
});

// DELETE /api/notes/:id end point
app.delete("/api/notes/:id", (req, res)=>{
    let id = req.params.id; // Get the id from the parameters
    // Read the database
    fs.readFile("./db/db.json", (err, data)=>{
        let currentDb = JSON.parse(data);
        const newDb = currentDb.filter((note)=>!(id === note.id)); // Remove the note with the matching id
        fs.writeFile("./db/db.json", JSON.stringify(newDb), (err)=>{ // Rewrite database
            err ? console.log(err) : console.log(`Successfully deleted note ${id}.`); // Check for errors
        });
    });
    res.json("Delete request processed.");
});

// Default end point
app.get("*", (req, res)=>{
    // Send the index.html file
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Start the app
app.listen(PORT, ()=>{
    console.log(`Started server on http://localhost:${PORT}`);
});
