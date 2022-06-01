const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const app = express();

const connectionString =
    "mongodb+srv://alex:haspass@cluster0.thhqcnr.mongodb.net/?retryWrites=true&w=majority";

//Connect to database using connection string above
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then((client) => {
        const db = client.db("star-wars-quotes");
        const quotesCollection = db.collection("quotes");

        //EJS lets us add HTML to our document using javascript
        app.set("view engine", "ejs");

        //Tells Express to make the 'public' folder accessible to the public
        app.use(express.static("public"));
        //Allows server to read JSON
        app.use(bodyParser.json());

        //Body parser, used by express to read data
        app.use(bodyParser.urlencoded({ extended: true }));

        //READ operation done through GET
        // app.get("/", (req, res) => {
        //     res.sendFile(__dirname + "/index.html");
        // });

        //CREATE operation done through a POST
        app.post("/quotes", (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then((result) => {
                    res.redirect("/");
                })
                .catch((error) => console.error(error));
        });

        app.get("/", (req, res) => {
            db.collection("quotes")
                .find()
                .toArray()
                .then((results) => {
                    res.render("index.ejs", { quotes: results });
                })
                .catch(/* ... */);
        });

        app.put("/quotes", (req, res) => {
            quotesCollection
                .findOneAndUpdate(
                    { name: "Alex" },
                    {
                        $set: {
                            name: req.body.name,
                            quote: req.body.quote,
                        },
                    },
                    {
                        upsert: true,
                    }
                )
                .then((result) => {
                    res.json("Success");
                })
                .catch((error) => console.error(error));
        });

        app.delete("/quotes", (req, res) => {
            quotesCollection
                .deleteOne({ name: req.body.name })
                .then((result) => {
                    if (result.deletedCount === 0) {
                        return res.json("No quote to delete");
                    }
                    res.json(`Deleted Darth Vadar's quote`);
                })
                .catch((error) => console.error(error));
        });

        //Create a server that browsers can connect to
        app.listen(3000, function () {
            console.log("listening on 3000");
        });
    })
    .catch(console.error);
