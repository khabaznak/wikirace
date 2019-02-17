## Wiki Racer Service
This project is a Wikipedia Racer experiment. 
It was created using:
* Node JS
* Express.js
* Docker

You'll need to have docker installed in your computer in order to run it.

# Docker command for  building:
docker build --no-cache -t wikirace .

# Docker command for running:
docker run -it --rm --name latest -p 8080:8080 -v ${PWD}/:/home/xpress/wikirace wikirace /bin/bash

The ${PWD} variable used to map the volume here is different if you use docker for windows. So, please be mindful.

It is worth noting that the command listed above allows you to remain inside the image so you'll still need to run the service in order to test it. 

# Command to run the WikiRacer service:
node wikirace.js

# Once it's up an running...
Now you can use CURL or any other REST client of your preference and try it out. 
Make sure you use the following query parameters when testing the service: start, end
Where start will contain the starting Wikipedia article, ie: https://en.wikipedia.org/wiki/Tesla
and end will contain the ending or target Wikipedia article. Ie: https://en.wikipedia.org/wiki/Nikola_Tesla
