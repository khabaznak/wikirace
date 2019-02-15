'use strict'
const axios = require('axios');
const HTMLParser = require('node-html-parser');

exports.getWikiArticleLinks = (articleUrl, responseObject)=>{
    axios.get(articleUrl)
    .then(response => {
            var article = HTMLParser.parse(response.data);
            var links = article.querySelectorAll('a')
                                .map((l)=>{return l.rawAttrs;})
                                .filter((l) => {return l.includes('https');})
                                .map((l) => { 
                                    return l.split(' ')
                                            .filter(s=>{return s.includes('https');})[0];
                                    })
                                .map((l) => {
                                    return l.replace('href="','')
                                            .replace('"','');
                                });
            console.log(links);
            
            responseObject.send(links);
        })
        .catch(error => {
            console.log('catch',error);
        });
    
};

