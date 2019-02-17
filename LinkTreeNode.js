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
        this.children.push(child);
    }

    static async traverseBreadthFirst(compareFunction, callback, queue, hopLimit) {
        var hopCount = 0;
        while(queue.length > 0 && hopCount < hopLimit) {
            let root = queue.shift();
            console.log(`root: ${root.url}`);
            if(compareFunction(root.title)){
                callback(root);
                break;
            } else {
                hopCount++;
                try{
                    for(let child of root.children){
                        await child.expand(); //TODO See if you can place all calls in paralel and wait for this level to finish instead of each node.
                        queue.push(child);
                    }
                }catch(error){
                    console.log(`Error while trying to expand children of ${root.title}\n ${error}`);
                }
            }
        }
        console.log(`Ran out of hops? ${hopCount}`);
    }

    /**Expands this node and finds all children links  */
    async expand( callback ) {
        try{
            let article = await wikiRacer.getParsedWikiArticle(this.url );
            this.title = wikiRacer.getWikiArticleTitle(article);
            let aLinks = wikiRacer.getWikiArticleLinks(article);
            aLinks.forEach(link => {
                let childNode = new LinkTreeNode('',link);
                this.addChildNode(childNode);
            }, this);
            console.log(`Adding ${this.childrenCount()} children of: ${this.title}`);
            callback?callback():null;
            return true;
        } catch(error){
            console.log('Error in Expand method,', error);
            return false;
        }
    }
};

module.exports = LinkTreeNode;
