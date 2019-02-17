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

    static async traverseBreadthFirst(compareFunction, sortCompareFunction, callback, queue, hopLimit, expandedNodes) {
        var hopCount = 0;
        var shiftCount = 0;
        var shiftWorth = [queue[0].childrenCount()]; //how many shifts are worth 1 hop
        while(queue.length > 0 && hopCount <= hopLimit) {
            let root = queue.shift();
            shiftCount++;
            console.log(`Current hop is worth: ${shiftWorth[hopCount]} shifts. and you are at shift ${shiftCount}`);

            if(compareFunction(root.title)){
                callback(root);
                hopCount = hopLimit +1;
                break;
            } else {
                if(shiftCount >=shiftWorth[hopCount]){
                    hopCount++; // TODO: Hop count is incorrect, this is counting only shifts
                    shiftWorth.push(queue.length - shiftCount);
                    shiftCount = 0;
                }
               
                if(!expandedNodes.includes(root.title)) {
                    try{
                        console.log(`Expanding node: ${root.title}, from a total of: ${queue.length}`);
                        expandedNodes.push(root.title);
                        console.log(`Expanded so far: ${expandedNodes}\n`);
                        //Let's sort the children to see if there are potential matches...
                        //root.children.sort(sortCompareFunction);
                        for(let child of root.children){
                            await child.expand(); //TODO See if you can place all calls in paralel and wait for this level to finish instead of each node.
                            queue.push(child);
                        }
                    }catch(error){
                        console.log(`Error while trying to expand children of ${root.title}\n ${error}`);
                    }
                } else {
                    console.log(`Expanded so far: ${expandedNodes}`);
                    console.log(`Node ${root.title} had already been expanded. Skipping...`);
                }
                console.log('Done Expanding. \nNext up is ' + queue[0].title);
            }
        }
    }

    /**Expands this node and finds all children links  */
    async expand( callback ) {
        try{
            let article = await wikiRacer.getParsedWikiArticle(this.url );
            this.title = wikiRacer.getWikiArticleTitle(article);
            //console.log(`Expanding node: ${this.title}`);
            let aLinks = wikiRacer.getWikiArticleLinks(article);
            aLinks.forEach(link => {
                let childNode = new LinkTreeNode('',link);
                this.addChildNode(childNode);
            }, this);
            //console.log(`Adding ${this.childrenCount()} children of: ${this.title}`);
            callback?callback():null;
            return true;
        } catch(error){
            console.log('Error in Expand method,', error);
            return false;
        }
    }

    getPath(targetTitle) {
        let path =[];
        let done = false;
        let stack = [this];
        let visitedStack = [];
        
        
        while(!done && stack.length > 0) {
            let currentNode = stack.pop();
            path.push({title:currentNode.title, url:currentNode.url});
            visitedStack.push(currentNode.title);

            if(currentNode.title === targetTitle) {
                done = true;
            } else if(currentNode.childrenCount() === 0){
                path.pop();
            } else {
                path.pop();
                for(let i =0; i<currentNode.childrenCount();i++){
                    if(!visitedStack.includes(currentNode.children[i].title)){
                        stack.push(currentNode);
                        stack.push(currentNode.children[i]);
                    }
                }
            }
        }

        return path;
    }
};

module.exports = LinkTreeNode;
