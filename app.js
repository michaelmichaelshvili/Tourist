const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
var users_module = require('./users_module');
var poi_module = require('./poi_module');
const { check, validationResult } = require('express-validator/check');
var jwt = require("jsonwebtoken");
var cors = require('cors');
app.use(bodyParser.json(), cors());
app.options('*', cors());

var secret = "Eran&Michael4Life";
options = { expiresIn: "12h" };

app.use("/private", (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) res.status(401).send("Access denied. No token provided.");
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        req.body.username = decoded.username;
        next();
    } catch (exception) {
        console.log(exception);
        res.status(400).send("Invalid token.");
    }
});

//Register.   JSON({fname, lname, city, country, email, username, password, interests, Q&A’s}).
app.post("/Register", [
    check('username').isLength(3, 8).withMessage("user name must be in lenth between 3-8"),
    check('username').isAlpha().withMessage("user name must be only letters"),
    check('password').isLength(5, 10).withMessage("password need to be 5-10 length"),
    check('password').isAlphanumeric().withMessage("password must be only letters or digits"),
    check('firstname').isLength({ min: 1, max: 50 }).withMessage("first name must be 1-50 length"),
    check('firstname').isAlpha().withMessage("first name must be only letters"),
    check('lastname').isLength({ min: 1, max: 50 }).withMessage("last name must be 1-50 length"),
    check('lastname').isAlpha().withMessage("last name must be only letters"),
    check('city').isLength({ min: 1, max: 50 }).withMessage("city name must be 1-50 length"),
    check('email').isEmail().withMessage("invalid mail"),
    check('QAs').custom(array => {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                if (array[i][j].length < 1 || array[i][j].length > 50) {
                    throw new Error("answer or question is not good");
                }
            }
        }
        if (array.length < 2) {
            throw new Error("You must answer at least two question");
        }
        return true;
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        messages = [];
        for (var i = 0; i < errors.array().length; i++) {
            messages[i] = errors.array()[i].msg;
        }
        res.send(messages);
    }
    else {
        users_module.addUser(req.body)
            .then(result => res.send(result))
            .catch(error => res.send(error.message));
    }
});

//Login.  JSON({Username, Password}).  Token
app.post("/login", (req, res) => {
    // console.log("enter");
    users_module.login(req.body)
        .then(function (result) {
            // console.log("then");
            if (result) {
                var payload = { username: req.body.username };
                const token = jwt.sign(payload, secret, options);
                res.send(token);
            }
            else {
                res.send("User or password does not exists");
            }
        })
        .catch(error => res.send(error.message));
    // res.send(req.password);
});


app.post("/restore_password", (req, res) => {
    users_module.restore_password(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.get("/getAllCategories", (req, res) => {
    poi_module.getAllCategories()
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.get("/getAllPOI", (req, res) => {
    poi_module.getAllPOI()
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.get("/private/getLastSavePOI", (req, res) => {
    poi_module.getLastSavePOI(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.post("/private/saveAsFavorites", (req, res) => {
    poi_module.saveAsFavorites(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.post("/private/RankPOI", [
    check("rate").custom(rate => {
        if (rate < 1 || rate > 5) {
            throw new Error("rank need to be between 1-5");
        }
        return true;
    })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        messages = [];
        for (var i = 0; i < errors.array().length; i++) {
            messages[i] = errors.array()[i].msg;
        }
        res.send(messages);
    }
    poi_module.RankPOI(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

//return one point for 2 categories of the user
app.get("/private/getMostPopularPOI", (req, res) => {
    Object.assign(req.body, req.query);
    poi_module.getMostPopularPOI(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.get("/private/getFavoritePOI", (req, res) => {
    poi_module.getFavoritePOI(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.get("/getRandomPOI", (req, res) => {
    Object.assign(req.body, req.query);
    poi_module.getRandomPOI(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

app.get("/getPOIDetail", (req, res) => {
    Object.assign(req.body, req.query);
    poi_module.getPOIDetail(req.body)
        .then(result => res.send(result))
        .catch(error => res.send(error.message));
});

const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
