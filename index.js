const connectToMongo = require("./db");
const express =require("express");
const cors = require("cors");
connectToMongo();
const dotenv = require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json())
app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"))

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log("dbNotes app listening on port "+port)
})