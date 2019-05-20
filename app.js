const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
var DButilsAzure = require('./DButils');
const jsha = require("js-sha256");
// jsha.sha256()


// async function getUser() {
//     await DButilsAzure.execQuery("INSERT INTO Users_Table VALUES ('a','"+jsha.sha256('a')+"')");

//     try {
//         const user = await DButilsAzure.execQuery("SELECT * FROM Users_Table")
//         return user;
//     } catch (error) {
//         console.log(error)
//     }
// }
// app.get("/a", (req, res) => {
//     getUser()
//     .then(function(result){
//         res.send(result)
//     })
//     .catch(function(err){
//         console.log(err)
//         res.send(err)
//     })
// });

// app.post("/password", (req, res) => {
//     console.log(req.body);
//     res.send("ok")
// });

// // getPOIDetail.  ({pointName}).  JSON({viewNum, description, rating, reviews})
// app.get("/", (req, res) => {
//     res.send("sasasd");
// });

// //getRandomPOI. - (or minimalRank as parameter).  JSON({POI's})
// app.get("/", (req, res) => {
//     res.send("hellosas");
// });

// //getFavoritePOI.   JSON({username}).   JSON({POI's})   
// app.get("/", (req, res) => {
//     res.send("hellosas");
// });

// //getMostPopularPOI.   JSON({username}).  JSON({POI's})
// app.get("/", (req, res) => {
//     res.send("hellosas");
// });

// //getLastSavePOI.   JSON({username}).   JSON({POI's})
// app.get("/", (req, res) => {
//     res.send("hellosas");
// });


// //getAllPOI.        .  JSON({POI's})
// app.get("/", (req, res) => {
//     res.send("hellosas");
// });

// //getAllCategory.     . JSON({categories})
// app.get("/", (req, res) => {
//     res.send("hellosas");
// });

// app.post("/password", (req, res) => {
//     res.send(req.body.password);
// });

// //Login.  JSON({Username, Password}).  Token
// app.post("/login", (req, res) => {
//     res.send(req.password);
// });

// //RestorePassword.  JSON ({username,question,answer}).    password
// app.post("/", (req, res) => {
//     res.send("hellosas");
// });

//Register.   JSON({fname, lname, city, country, email, username, password, interests, Q&A’s}).

async function getUser(username) {
    try {
        var result = await DButilsAzure.execQuery("SELECT * FROM Users_Table WHERE id = '"+username+"'");
        console.log(result.length);
        if(result.length>0){
            console.log(result);
            return result;
        }
    }
    catch{ }
}

async function register(info){
    var username = info.username;
    var some =  await getUser(username);
    console.log(some);
    return some;


}
app.post("/Register", (req, res) => {
    register(req.body)
        .then(result=>res.send(result));

    
});

//saveAsFavorites.   JSON({username,pointNames}).   
// app.post("/", (req, res) => {
//     res.send("hellosas");
// });

// //reviewPOI.   JSON({username, review })
// app.post("/", (req, res) => {
//     res.send("hellosas");
// });


const port = process.env.PORT || 3000; //environment variable
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
