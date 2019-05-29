var DButilsAzure = require('./DButils');
const jsha = require("js-sha256");

async function existsUser(username) {
    try {
        var result = await DButilsAzure.execQuery("SELECT * FROM Users_Table WHERE id = '" + username + "'");
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
        await DButilsAzure.execQuery("INSERT INTO Users_Table (username,password,firstname,lastname,city,country,email) VALUES ('" + user_info.username + "', '" + jsha.sha256(user_info.password) + "', '" + user_info.firstname + "', '" + user_info.lastname + "', '" + user_info.city + "','" + user_info.country + "', '" + user_info.email + "')");
        for (var i = 0; i < Object.keys(user_info.categories).length; i++) {
            await DButilsAzure.execQuery("INSERT INTO Users_Categories_Table VALUES (" + user_info.username + "','" + user_info.categories[i] + "')");
        }
        for (var i = 0; i < Object.keys(user_info.QA).length; i++) {
            await DButilsAzure.execQuery("INSERT INTO Users_QA_Table VALUES (" + user_info.username + "','" + user_info.QA[i][0] + "','" + user_info.QA[i][1] + "')");
        }
        return true;
    }
    catch (error) {
        console.log(error);
        console.log("addUser error");
        return false;
    }
}

async function register(info, res) {
    var username = info.username;
    var existUser = existsUser(username);
    if (!existUser) {
        var result = await DButilsAzure.execQuery(`INSERT INTO Users_Table 
                                                    (fname, lname, city, country, email, username, password) 
                                                    VALUES ('${info.fname}','${info.lname}','${info.city}','${info.country}','${info.email}','${info.username}','${jsha.sha256('a')}')`);
        //Todo: check if result ok
        // res
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

async function getUserQuestion() {
    //Todo
}

async function restore_password(info, res) {
    var user_exists = existsUser(info.username);

    if (user_exists) {
        var question = getUserQuestion(info.username, info.question);
        if (question.length > 0) {
            // Todo:  res-> return ok signal

        }
        else {
            console.log("not exists such question");
        }
    }
    else {
        console.log("not exists such user");
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