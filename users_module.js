var DButilsAzure = require('./DButils');
// const jsha = require("js-sha256");
var parseString = require("xml2js").parseString;
var fs = require("fs");
var convert = require('xml-js');
var jsonContries;
var poi_module = require('./poi_module');


async function parseCountries() {
    fs.readFile("countries.xml", "utf-8", function (err, data) {
        if (err) console.log(err);
        parseString(data, function (err, result) {
            if (err) console.log(err);
            jsonContries = result;
        });
    });
}

async function existsUser(username) {
    try {
        var result = await DButilsAzure.execQuery("SELECT * FROM Users_Table WHERE username = '" + username + "'");
        if (result.length == 1) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        console.log("existsUser error");
    }
}

async function addUser(user_info) {
    try {
        var isValidCountry = false;
        var isValidcategories = true;
        for (var i = 0; i < Object.keys(jsonContries.Countries.Country).length; i++) {
            if (user_info.country === jsonContries.Countries.Country[i].Name[0]) {
                console.log
                isValidCountry = true;
            }
        }
        var posCategories = await poi_module.getAllCategories();
        if (Object.keys(user_info.categories).length >= 2) {
            for (var i = 0; i < Object.keys(user_info.categories).length; i++) {
                isValidcategories = isValidcategories && posCategories.some(item => item.name == user_info.categories[i]);
            }
        }
        else {
            isValidcategories = false;
        }
        if (isValidcategories && isValidCountry) {
            try {
                await DButilsAzure.execQuery("INSERT INTO Users_Table (username,password,firstname,lastname,city,country,email) VALUES ('" + user_info.username + "', '" + user_info.password + "', '" + user_info.firstname + "', '" + user_info.lastname + "', '" + user_info.city + "','" + user_info.country + "', '" + user_info.email + "')");
            } catch (error) {
                console.log(error);
                return error;
            }
            try {
                for (var i = 0; i < Object.keys(user_info.categories).length; i++) {
                    await DButilsAzure.execQuery("INSERT INTO Users_Categories_Table VALUES ('" + user_info.username + "','" + user_info.categories[i] + "')");
                }
            } catch (error) {
                console.log(error);
                return error;
            }
            try {
                for (var i = 0; i < Object.keys(user_info.QA).length; i++) {
                    await DButilsAzure.execQuery("INSERT INTO Users_QA_Table VALUES ('" + user_info.username + "','" + user_info.QA[i][0] + "','" + user_info.QA[i][1] + "')");
                }
            } catch (error) {
                console.log(error);
                return error;
            }
            return true;
        }
        else {
            console.log(isValidcategories + "," + isValidCountry);
            return false;
        }
    }
    catch (error) {
        console.log(error);
        console.log("addUser error");
        return error;
    }
}


async function deleteUser(username) {
    try {
        await DButilsAzure.execQuery("DELETE FROM Users_TAble WHERE username = '" + username + "'");
        await DButilsAzure.execQuery("DELETE FROM Users_Categories_Table WHERE username = '" + username + "'");
        await DButilsAzure.execQuery("DELETE FROM Users_QA_Table WHERE username = '" + username + "'");
        return true;
    } catch (error) {
        console.log(error);
        console.log("seleteuser error");
        return false;
    }
}

async function getUser(username) {
    try {
        const user = await DButilsAzure.execQuery("SELECT * FROM Users_Table WHERE username = '" + username + "'");
        return user;
    } catch (error) {
        console.log(error);
        console.log("getUser error");
        return undefined;
    }
}

async function getUserQuestionAnswer(username) {
    const ans = await DButilsAzure.execQuery(`SELECT question_id , answer FROM Users_QA_Table WHERE username = '${username}'`);
    return ans;
}

async function restore_password(info, res) {
    var user_exists = existsUser(info.username);
    if (user_exists) {
        const qa = await getUserQuestionAnswer(info.username);
        var correctQA = qa.some(item=>item.question_id==info.question&&item.answer==info.answer);
        if(correctQA)
        {
            const password = await DButilsAzure.execQuery(`SELECT password FROM Users_Table WHERE username = '${info.username}'`);
            return password;
        }
        else{
            return false;
        }
    }
    else {
        console.log("not exists such user");
        return false;
    }
}

async function login(info, res) {
    var result = getUser(info.username);
    if (result.length > 0) {
        if (jsha.sha256(info.password) == result[0].password) {
            // Todo:  res-> return ok signal
        }
        else {
            console.log("password incorrect");
        }
    }
    else {
        console.log("not exists such user");
    }
}

module.exports.existsUser = existsUser;
module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.getUser = getUser;
module.exports.restore_password = restore_password;
module.exports.login = login;
module.exports.parseCountries = parseCountries;
module.exports.jsonContries = jsonContries;

// async function getUsers(username) {
//     try {
//         var result = await DButilsAzure.execQuery("SELECT * FROM Users_Table");
//         console.log(result.length);
//         // if(result.length>0){
//             // console.log(result[0]);
//             // console.log(result[1]);
//             return result;
//         // }
//     }
//     catch{ }
// }
// async function getUser(username) {
//     var result = await DButilsAzure.execQuery("SELECT * FROM Users_Table WHERE id = '" + username + "'");
//     return result;
// }
// async function existsUser(username) {
//     var result = getUser(username)
//     if (result.length == 1) {
//          return true;
//     }
//     return false;     
// }