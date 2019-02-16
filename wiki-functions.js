'use strict'
const axios = require('axios');
const HTMLParser = require('node-html-parser');

const FIRST_HEADER_SELECTOR = '#firstHeading';
const WIKI_ARTICLE_MAIN_BODY_SELECTOR = 'div#bodyContent';
const WIKI_LINKS_SELECTOR = 'a';
const HTTPS_STRING = 'https';
const WIKIPEDIA_LINK_STRING = '/wiki/';
const HREF_STRING = 'href="';
const CLOSING_QUOTE_STRING = '"';

/**Returns an Array with all the valid links from the wikiArticle object 
 * which is passed as a parameter */
exports.getWikiArticleLinks = (wikiArticle) => {
    let articleBody = wikiArticle.querySelector(WIKI_ARTICLE_MAIN_BODY_SELECTOR);
    var links = articleBody.querySelectorAll(WIKI_LINKS_SELECTOR)
                            .map((l) => {return l.rawAttrs;}) //Getting raw attributes
                            .filter((l) => {return l.includes(HTTPS_STRING);})
                            .map((l) => { 
                                return l.split(' ')
                                        .filter(s => {
                                            return s.includes(HTTPS_STRING) && s.includes(WIKIPEDIA_LINK_STRING);
                                        })[0];
                            })
                            .map((l) => {
                                return l.replace(HREF_STRING,'')
                                .replace(CLOSING_QUOTE_STRING,'');
                            });
    return links;
};

function LinkTreeNode(title, id, childrenNodes) {
    this.title = title;
    this.id = id;
    this.children = childrenNodes;
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
