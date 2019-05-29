var DButilsAzure = require('./DButils');

async function getPOIDetail(info) {
    const poi = await DButilsAzure.execQuery("SELECT * FROM POI_Table WHERE name = '" + info.name + "'");
    if (poi.length == 1)
        return poi[0];
    throw new Error("Point not exists");

}



async function getRandomPOI(info, res) {
    var minimalRank = info.minimalRank || 3.5;
    var number_of_elements = 3;
    const poi = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM POI_Table WHERE rate >= ${minimalRank} ORDER BY newid()`);
    return poi;
}



async function getMostPopularPOI(info, res) {
    var number_of_categories = info.number_of_categories || 2;
    const categories = await DButilsAzure.execQuery(`SELECT TOP ${number_of_categories} category_name FROM Users_Categories_Table WHERE username = '${info.username}' ORDER BY newid()`);
    var number_of_elements = info.number_of_elements || 1;
    var pois = [];
    for (var i = 0; i < number_of_categories; i++) {
        const poi = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM POI_Table WHERE category_name = '${categories[i].category_name}' ORDER BY rate DESC`);
        pois[i] = poi;//TODO clone
    }
    return pois;
}



async function RankPOI(info) {
    try {
        await DButilsAzure.execQuery(`INSERT INTO Users_Reviews_Table (poi_name,reviewer_name,rate,review_content) VALUES ('${info.poi_name}','${info.reviewer_name}','${info.rate}','${info.review_content}')`);
        const count_sql = await DButilsAzure.execQuery(`SELECT COUNT(*) as count FROM Users_Reviews_Table WHERE poi_name = '${info.poi_name}'`);
        const rate_sql = await DButilsAzure.execQuery(`SELECT rate FROM POI_Table WHERE name = '${info.poi_name}'`);
        var rate = rate_sql[0].rate;
        var count = count_sql[0].count;
        await DButilsAzure.execQuery(`UPDATE POI_Table SET rate = '${(rate * (count - 1) + parseInt(info.rate)) / count}' WHERE name = '${info.poi_name}'`);
        return true;
    }
    catch (error) {
        return error
    }

}

async function getFavoritePOI(info) {
    const pois = await DButilsAzure.execQuery(`SELECT name,description,watchers_count,rate,category_name,picture,rank FROM Users_POI_Table, POI_Table WHERE name=poi_name AND username = '${info.username}'`);
    return pois;
}

async function saveAsFavorites(info) {
    var pois = "'" + info.pois.join("','") + "'";
        await DButilsAzure.execQuery(`DELETE FROM Users_POI_Table WHERE username = '${info.username}' AND poi_name NOT IN (${pois})`);
        for (var i = 0; i < info.pois.length; i++) {
            const result = await DButilsAzure.execQuery(`SELECT * FROM Users_POI_Table WHERE username = '${info.username}' AND poi_name = '${info.pois[i]}'`);
            if (result.length == 1)//if exists
            {
                await DButilsAzure.execQuery(`UPDATE Users_POI_Table SET rank = '${i + 1}' WHERE username = '${info.username}' AND poi_name = '${info.pois[i]}'`);
                //update row.rank to i
            }
            else {
                await DButilsAzure.execQuery(`INSERT INTO Users_POI_Table (username,poi_name,rank) VALUES ('${info.username}','${info.pois[i]}','${i + 1}')`);
                //insert with rank = i
            }
        }
        return true;
}



async function getLastSavePOI(info, res) {
    var number_of_elements = info.number_of_elements || 2;
    const pois = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM Users_POI_Table WHERE username = '${info.username}' ORDER BY date DESC`);
    var pois_return = [];
    for (var i = 0; i < number_of_elements; i++) {
        const poi = await DButilsAzure.execQuery(`SELECT * FROM POI_Table WHERE name = '${pois[i].poi_name}'`);
        pois_return[i] = poi;//TODO clone
    }
    return pois_return;
}



async function getAllPOI(info, res) {
    const allpois = await DButilsAzure.execQuery(`SELECT * FROM POI_Table`);
    return allpois;
}



async function getAllCategories(info, res) {
    const allCategories = await DButilsAzure.execQuery(`SELECT name FROM Categories_Table`);
    return allCategories;
}

//functions
////public
module.exports.getAllPOI = getAllPOI;
module.exports.getPOIDetail = getPOIDetail;
module.exports.getRandomPOI = getRandomPOI;
module.exports.getAllCategories = getAllCategories;
////private
module.exports.getMostPopularPOI = getMostPopularPOI;
module.exports.RankPOI = RankPOI;
module.exports.getLastSavePOI = getLastSavePOI;
module.exports.saveAsFavorites = saveAsFavorites;
module.exports.getFavoritePOI = getFavoritePOI;