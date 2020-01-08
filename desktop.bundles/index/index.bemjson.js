const path = require('path');
const fs = require('fs');
const jsonPath = path.resolve(`pages/index.json`);
const bemjson = JSON.parse(fs.readFileSync(jsonPath, {encoding: 'utf-8'}));

module.exports = {
    title: 'Title of the page',
    favicon: '/favicon.ico',
    head: [
        { elem: 'meta', attrs: { name: 'description', content: '' }},
        { elem: 'css', url: 'style.css' }
    ],
    scripts: [{ elem: 'js', url: 'script.js' }],
    ...bemjson
}

