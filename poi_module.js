var DButilsAzure = require('./DButils');

async function getPOIDetail(info) {
    const poi = await DButilsAzure.execQuery("SELECT * FROM POI_Table WHERE name = '" + info.name + "'");
    const reviews = await DButilsAzure.execQuery(`SELECT TOP 2 rate,review_content,date FROM Users_Reviews_Table WHERE poi_name='${info.name}' ORDER BY date DESC `)
    await DButilsAzure.execQuery(`UPDATE POI_Table SET watchers_count='${poi[0].watchers_count+1}' WHERE name = '${info.name}'`);
    if (poi.length == 1){
        poi[0].reviews = reviews;
        return poi[0];
    }
    throw new Error("Point does not exists");
}


async function getRandomPOI(info) {
    var minimalRank = Math.min(info.minimalRank||5 ,3.5);
    var number_of_elements = 3;
    const poi = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM POI_Table WHERE rate >= ${minimalRank} ORDER BY newid()`);
    return poi;
}

async function getMostPopularPOI(info) {
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
        info.name=info.poi_name;
        const detail = await getPOIDetail(info);
        await DButilsAzure.execQuery(`INSERT INTO Users_Reviews_Table (poi_name,reviewer_name,rate,review_content) VALUES ('${info.poi_name}','${info.username}','${info.rate}','${info.review_content}')`);
        const count_sql = await DButilsAzure.execQuery(`SELECT COUNT(*) as count FROM Users_Reviews_Table WHERE poi_name = '${info.poi_name}'`);
        const rate_sql = await DButilsAzure.execQuery(`SELECT rate FROM POI_Table WHERE name = '${info.poi_name}'`);
        var rate = rate_sql[0].rate;
        var count = count_sql[0].count;
        await DButilsAzure.execQuery(`UPDATE POI_Table SET rate = '${(rate * (count - 1) + parseInt(info.rate)) / count}' WHERE name = '${info.poi_name}'`);
        return true;
    }
    catch (error) {
        throw error;
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
            //update row.rank to i
            await DButilsAzure.execQuery(`UPDATE Users_POI_Table SET rank = '${i + 1}' WHERE username = '${info.username}' AND poi_name = '${info.pois[i]}'`);
        }
        else {
            //insert with rank = i
            await DButilsAzure.execQuery(`INSERT INTO Users_POI_Table (username,poi_name,rank) VALUES ('${info.username}','${info.pois[i]}','${i + 1}')`);
        }
    }
    return true;
}



async function getLastSavePOI(info) {
    var number_of_elements = info.number_of_elements || 2;
    const pois = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM Users_POI_Table WHERE username = '${info.username}' ORDER BY date DESC`);
    var pois_return = [];
    for (var i = 0; i < pois.length; i++) {
        const poi = await DButilsAzure.execQuery(`SELECT * FROM POI_Table WHERE name = '${pois[i].poi_name}'`);
        pois_return[i] = poi;//TODO clone
    }
    return pois_return;
}



async function getAllPOI() {
    const allPois = await DButilsAzure.execQuery(`SELECT * FROM POI_Table`);
    return allPois;
}



async function getAllCategories() {
    const allCategories = await DButilsAzure.execQuery(`SELECT name FROM Categories_Table`);
    categories = [];
    for(var i=0;i<allCategories.length;i++)
    {
        categories[i] = allCategories[i].name;
    }
    return categories;
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