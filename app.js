const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
var DButilsAzure = require('./DButils');
var users_module  = require('./users_module');
var poi_module  = require('./poi_module');
const jsha = require("js-sha256");
const { check, validationResult } = require('express-validator/check');

var secret = "Eran&Michael4Life";

app.post("/private", (req, res) => {
    const token = req.header("x-auth-token");
    if (!token) res.status(401).send("Access denied. No token provided.");
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        next();
    } catch (exception) {
		console.log(exception);
        res.status(400).send("Invalid token.");
    }
});

//Register.   JSON({fname, lname, city, country, email, username, password, interests, Q&A’s}).
app.post("/Register",[
    check('username').isLength(3,8),
    check('username').isAlpha(),
    check('password').isLength(5,10),
    check('password').isAlphanumeric(),
    check('firstname').isLength({min: 1, max: 50}),
    check('firstname').isAlpha(),
    check('lastname').isLength({min: 1, max: 50}),
    check('lastname').isAlpha(),
    check('city').isLength({min: 1, max: 50}),
    check('email').isEmail(),
] ,(req, res) => {
    users_module.addUser(req.body,res)
        .then(result=>res.send(result))
        .catch(error=>res.send(error.message));
    
});

//Login.  JSON({Username, Password}).  Token
app.post("/login", (req, res) => {
    users_module.login(req.body,res)
        .then(result=>res.send(result))
        .catch(error=>res.send(error.message));
    // res.send(req.password);
});


app.post("/restore_password", (req, res) => {
    users_module.restore_password(req.body,res)
        .then(result=>res.send(result))
        .catch(error=>res.send(error.message));
    // res.send(req.password);
});

app.get("/getAllCategories", (req, res) => {
    poi_module.getAllCategories(req.body, res)
    .then(result=>res.send(result))
    .catch(error=>res.send(error.message));
});

app.get("/getAllPOI", (req, res) => {
    poi_module.getAllPOI(req.body, res)
    .then(result=>res.send(result))
    .catch(error=>res.send(error.message));
});

app.get("/getLastSavePOI", (req, res) => {
    poi_module.getLastSavePOI(req.body, res);
    res.send("ok");
});

app.get("/RankPOI", (req, res) => {
    poi_module.RankPOI(req.body, res);
    res.send("ok");
});
app.get("/getMostPopularPOI", (req, res) => {
    var pois = poi_module.getMostPopularPOI(req.body, res);
    res.send(pois);
});
app.get("/getRandomPOI", (req, res) => {
    poi_module.getRandomPOI(req.body, res);
    res.send("ok");
});
app.get("/getPOIDetail", (req, res) => {
    poi_module.getPOIDetail(req.body, res)
});

const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
