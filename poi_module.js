var DButilsAzure = require('./DButils');

async function getPOIDetail(info, res) {
    const poi = await DButilsAzure.execQuery("SELECT * FROM POI_Table WHERE name = '" + info.name + "'");
    if (poi.length == 1)
        return poi[0];
    console.log("poi with this name isnt exist");
    return undefined;

}



async function getRandomPOI(info, res) {
    var minimalRank = info.minimalRank || 1;
    var number_of_elements = info.number_of_elements;
    const poi = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM POI_Table WHERE rate >= ${minimalRank} ORDER BY RAND()`);
    return poi;
}



async function getMostPopularPOI(info, res) {
    var number_of_categories = info.number_of_categories || 2;
    const categories = await DButilsAzure.execQuery(`SELECT TOP ${number_of_categories} category_name FROM Users_Categories_Table WHERE username = '${info.username}' ORDER BY RAND()`);
    var number_of_elements = info.number_of_elements || 1;
    var pois = [];
    for (var i = 0; i < number_of_categories; i++) {
        const poi = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM POI_Table WHERE category_name = ${categories[i].category_name} ORDER BY rate DESC`);
        pois[i] = poi;//TODO clone
    }
    return pois;
}



async function RankPOI(info, res) {
    // const review = await DButilsAzure.execQuery(`SELECT * FROM Table_1 WHERE poi_name = ${info.poi_name} AND reviewer_name = ${info.reviewer_name}`);
    // if(review.length==1)
    // {
    //     //update
    //     await DButilsAzure.execQuery(`UPDATE Table_1 SET  (poi_name,reviewer_name,rate,review_content) VALUES ('${info.poi_name}','${info.reviewer_name}','${info.rate}','${info.review_content}')  WHERE poi_name = ${info.poi_name} AND reviewer_name = ${info.reviewer_name}`);
    // }
    // else
    // {
    //     create
    // assumption: poi exists
    await DButilsAzure.execQuery(`INSERT INTO Table_1 (poi_name,reviewer_name,rate,review_content) VALUES ('${info.poi_name}','${info.reviewer_name}','${info.rate}','${info.review_content}')`);
    const count_sql = await DButilsAzure.execQuery(`SELECT COUNT(*) FROM Table_1 WHERE poi_name = ${info.poi_name}`);
    const rate_sql = await DButilsAzure.execQuery(`SELECT rate FROM POI_Table WHERE name = ${info.poi_name}`);
    var rate = rate_sql[0].rate;
    var count = count_sql[0].count;//.COUNT?
    await DButilsAzure.execQuery(`UPDATE POI_Table SET rate = '${(rate * (count - 1) + info.rate) / count}' WHERE name = ${info.poi_name}`);

    // }

}



async function getLastSavePOI(info, res) {
    var number_of_elements = info.number_of_elements || 2;
    const pois = await DButilsAzure.execQuery(`SELECT TOP ${number_of_elements} * FROM Users_POI_Table WHERE username = ${info.username} ORDER BY date DESC`);
    var pois_return = [];
    for(var i=0;i<number_of_elements;i++)
    {
        const poi = await DButilsAzure.execQuery(`SELECT * FROM POI_Table WHERE name = '${pois[i].poi_name}'`);
        pois_return[i] = poi;//TODO clone
    }
    return pois_return;
}



async function getAllPOI(info, res) {
    const allPois = await DButilsAzure.execQuery(`SELECT * FROM POI_Table`);
    return allPois;
}



async function getAllCategories(info, res) {
    const allCategories = await DButilsAzure.execQuery(`SELECT name FROM Categories_Table`);
    return allCategories;
}

module.exports.getPOIDetail = getPOIDetail;
module.exports.getRandomPOI = getRandomPOI;
module.exports.getMostPopularPOI = getMostPopularPOI;
module.exports.RankPOI = RankPOI;
module.exports.getLastSavePOI = getLastSavePOI;
module.exports.getAllPOI = getAllPOI;
module.exports.getAllCategories = getAllCategories;
