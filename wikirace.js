'use strict';

const express = require('express');
const wikiRacer = require('./wiki-functions');
const LinkTreeNode = require('./LinkTreeNode');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => { 
    let root = new LinkTreeNode('','https://en.wikipedia.org/wiki/Tesla'); 
    let destination = new LinkTreeNode('','https://en.wikipedia.org/wiki/Elon_Musk');//TODO: obtain the url parameters from request body
    root.expand(() => {
        destination.expand(() => {
            //LinkTreeNode.traverseBreadthFirst((destinationTitle)=>{},(resultingNode)=>{},[root],3);
            res.send(`<h1>Yay Im ready!</h1><h2>from:${root.title}</h2><h2>to:${destination.title}</h2>`);
        });
    });
});

app.listen(PORT, HOST);
console.log(`Wiki Racer service is running on http://${HOST}:${PORT}`);

