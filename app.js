const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("hellosas");
});

const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
