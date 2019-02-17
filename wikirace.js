'use strict';

const express = require('express');
const wikiRacer = require('./wiki-functions');
const LinkTreeNode = require('./LinkTreeNode');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var queue =[];
var expanded=[];

// App
const app = express();
app.get('/', (req, res) => { 
    
    let startURL = req.query.start;
    let endURL = req.query.end;
    let root = new LinkTreeNode('',startURL); 
    let destination = new LinkTreeNode('',endURL);
    root.expand(() => {
        destination.expand(() => {
            queue.push(root);
            LinkTreeNode.traverseBreadthFirst((testTitle)=>{
                console.log(`Comparing: ${destination.title} vs ${testTitle}`);
                return destination.title === testTitle;
            },(a,b) => {
                let foundInA = a.url
                                .replace('https://en.wikipedia.org/wiki/','')
                                .replace(/_/g,' ')
                                .includes(destination.title);
                let foundInB = b.url
                                .replace('https://en.wikipedia.org/wiki/','')
                                .replace(/_/g,' ')
                                .includes(destination.title);

                if(foundInA && foundInB){
                    return 0;
                } else if( foundInA && !foundInB){
                    return 1;
                } else if(!foundInA && foundInB){
                    return -1;
                } else {
                    return 0;
                }
            },(resultingNode) => {
                console.log('Found Result!');
                let foundPath =root.getPath(destination.title);
                let payload = {
                    start: root.url,
                    end: destination.url,
                    path: [{title:root.title, url:root.url}, ...foundPath, {title: destination.title, url: destination.url}]
                };
                console.log(payload);
                let liPath = foundPath.map((step)=>{return `<li>${JSON.stringify(step)}</li>`;})
                                    .reduce((acc,cur) =>{return `${acc}${cur}`;});

                //res.send(`<h2>from: ${root.title}</h2><h2>to: ${destination.title}</h2><ul>${liPath}</ul> <div>${payload}</div>`);
                res.send(payload);
            },queue,3,expanded);
        });
    });
});

app.listen(PORT, HOST);
console.log(`Wiki Racer service is running on http://${HOST}:${PORT}`);

