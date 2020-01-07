const path = require('path');
const fs = require('fs');
const jsonPath = path.resolve(`pages/product.json`);
const bemjson = JSON.parse(fs.readFileSync(jsonPath, {encoding: 'utf-8'}));

module.exports = bemjson
