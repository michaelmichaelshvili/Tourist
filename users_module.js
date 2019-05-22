var DButilsAzure = require('./DButils');

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
        await DButilsAzure.execQuery("INSERT INTO Users_Table VALUES ('" + user_info.username + "', '" + user_info.password + "', '" + user_info.firstname + "', '" + user_info.lastname + "', '" + user_info.city + "','" + user_info.country + "', '" + user_info.email+"')");
        for(var i=0;i<Object.keys(user_info.categories).length;i++)
        {
            await DButilsAzure.execQuery("INSERT INTO Users_Categories_Table VALUES ("+user_info.username+"','" + user_info.categories[i]+"')");
        }
        for(var i=0;i<Object.keys(user_info.QA).length;i++)
        {
            await DButilsAzure.execQuery("INSERT INTO Users_QA_Table VALUES ("+user_info.username+"','" + user_info.QA[i][0]+"','" + user_info.QA[i][1]+"')");
        }
        return true;
    }
    catch(error)
    {
        console.log(error);
        console.log("addUser error");
        return false;
    }
}

async function deleteUser(username)
{
    try {
        await DButilsAzure.execQuery("DELETE FROM Users_TAble WHERE username = '" + username +  "'");
        await DButilsAzure.execQuery("DELETE FROM Users_Categories_Table WHERE username = '" + username +  "'");
        await DButilsAzure.execQuery("DELETE FROM Users_QA_Table WHERE username = '" + username +  "'");
        return true;
    } catch (error) {
        console.log(error);
        console.log("seleteuser error");
        return false;
    }
}

async function getUser(username) {
    try {
        const user = await DButilsAzure.execQuery("SELECT * FROM Users_Table WHERE username = '" +username +"'");
        return user;
    } catch (error) {
        console.log(error);
        console.log("getUser error");
        return undefined;
    }
}


module.exports.existsUser = existsUser;
module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.getUser = getUser;