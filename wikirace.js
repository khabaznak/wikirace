'use strict';

const express = require('express');
const wikiRacer = require('./wiki-functions');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    var x = wikiRacer.getWikiArticleLinks('https://en.wikipedia.org/wiki/Tesla',res);
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);