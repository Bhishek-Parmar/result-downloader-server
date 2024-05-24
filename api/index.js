const express = require("express");
const app = express();
const gradesheetsRouter = require('./routers/gradesheetRouter');

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle routes
app.get("/", (req, res) => res.send("Express on Vercel"));

app.use('/gradesheets', gradesheetsRouter);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;