'use strict'
const axios = require('axios');
const HTMLParser = require('node-html-parser');

exports.getWikiArticleLinks = (articleUrl, responseObject)=>{ //TODO: response object will not be needed here in this function.
    axios.get(articleUrl) 
    .then(response => {
            var article = HTMLParser.parse(response.data);
            var links = article.querySelectorAll('a') //TODO: Need to make sure you're only getting the links from body and avoiding the sidebar and footer.
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

exports.getLinkTree = () =>{
    return {rootName='', children:[]};
};
