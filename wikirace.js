'use strict';

const express = require('express');
const wikiRacer = require('./wiki-functions');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => { //TODO: review the req object to obtain the articles in the request body
    //var y = wikiRacer.getWikiArticleLinks('https://en.wikipedia.org/wiki/Elon_Musk',res);
    let articleA;
    wikiRacer.getParsedWikiArticle('https://en.wikipedia.org/wiki/Tesla', 
                                    (art)=>{
                                        articleA = art;
                                        let title = wikiRacer.getWikiArticleTitle(articleA);
                                        let aLinks = wikiRacer.getWikiArticleLinks(articleA);
                                        let htmlLinks = aLinks.map(l=>{return `<li>${l}</li>`;});
                                        res.send(`<H1>The article in question has a title: ${title}</H1><ul>${htmlLinks}</ul>`);
                                    });
});

app.listen(PORT, HOST);
console.log(`Wiki Racer service is running on http://${HOST}:${PORT}`);