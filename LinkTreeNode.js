'use strict';
const wikiRacer = require('./wiki-functions');

class LinkTreeNode {
    constructor( title, url) {
        this.title = title;
        this.url = url;
        this.children = [];
    }

    isExpanded() {
        return this.children.length > 0;
    }

    childrenCount() {
        return this.children.length;
    }

    addChildNode( child ) {
        this.children = [...this.children, child];
    }

    static traverseBreadthFirst(compareFunction, callback, queue, hopLimit) {
        var hopCount = 0;
        while(queue.length > 0 && hopCount < hopLimit) {
            let root = queue.shift();
            if(compareFunction(root.title)){
                callback(root);
                break;
            } else {
                hopCount++;
                root.children.forEach(child => {
                    child.expand();
                    queue.push(child);
                });
            }
        }
    }

    /**Expands this node and finds all children links  */
    expand() {
        let me = this;
        wikiRacer.getParsedWikiArticle(this.url, (art) => {
                                            me.title = wikiRacer.getWikiArticleTitle(art);
                                            let aLinks = wikiRacer.getWikiArticleLinks(art);
                                            aLinks.forEach(link => {
                                                let childNode = new LinkTreeNode('',link);
                                                this.addChildNode(childNode);
                                            }, this);
                                        });
    }
};

module.exports = LinkTreeNode;
