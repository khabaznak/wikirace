'use strict'
const axios = require('axios');
const HTMLParser = require('node-html-parser');

const FIRST_HEADER_SELECTOR = '#firstHeading';
const WIKI_ARTICLE_MAIN_BODY_SELECTOR = '#bodyContent';
const WIKI_LINKS_SELECTOR = 'a';
const HTTPS_STRING = 'https';
const WIKIPEDIA_LINK_STRING = '/wiki/';
const WIKTIONARY_LINK_STRING = 'wiktionary.org';
const WIKIPEDIA_BASE_URL_STRING = 'https://en.wikipedia.org';
const HREF_STRING = 'href="';
const CLOSING_QUOTE_STRING = '"';

/**Returns an Array with all the valid links from the wikiArticle object 
 * which is passed as a parameter */
exports.getWikiArticleLinks = (wikiArticle) => {
    let articleBody = wikiArticle.querySelector(WIKI_ARTICLE_MAIN_BODY_SELECTOR);
    let links = articleBody.querySelectorAll(WIKI_LINKS_SELECTOR)
                            .map((l) => {return l.rawAttrs;}) //Getting raw attributes
                            .filter((l) => {return l.includes(HREF_STRING);}) //Only links
                            .map((l) => { 
                                let validLink = l.split(' ')
                                                .filter(s => {
                                                    return s.includes(WIKIPEDIA_LINK_STRING) && !s.includes(WIKTIONARY_LINK_STRING);
                                                })[0];
                                
                                return validLink;
                            })
                            .filter((l)=>{return l !== undefined;})
                            .map((l) => {
                                return l.replace(HREF_STRING,WIKIPEDIA_BASE_URL_STRING)
                                .replace(CLOSING_QUOTE_STRING,'');
                            });
    return links;
};

/*This function returns a parsed HTML Parser element object which represents 
the Wiki Article in question via a callback function which is allso passed as parameter.
@param {function} callback is the callback function where article will be returned.*/
exports.getParsedWikiArticle = (articleUrl, callback) => {
    return axios.get(articleUrl)
    .then((response) => {
        var article = HTMLParser.parse(response.data);
        callback(article);
    })
    .catch((error) => { //TODO: Please note that this catch clause might catch problems in the axios get and also parsing problems...
        console.log(`Ooops! some weird problem occured: here your stacktrace:\n${error}`);
    });
};

/**This function returns the Title of the wiki Article in plain text. 
 * the wikiArticle is an HTML Parser Element object */
exports.getWikiArticleTitle = (wikiArticle) => {
    return wikiArticle.querySelector(FIRST_HEADER_SELECTOR).text;
};

// TODO: Create a function which determines if winning condition has been reached
exports.isRaceOver = () => {
 return false;
};
