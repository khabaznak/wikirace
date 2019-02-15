FROM debian:jessie-slim

LABEL Author="Alex Gomez <khabaznak@gmail.com>"

ARG user=xpress
ARG group=xpress
ARG project=wikirace

# install and cache app dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends git && \
    apt-get clean && \
    apt-get install -y sudo && \
    apt-get install -y npm 


# set working directory
RUN mkdir -p /home/${user}/${project}
WORKDIR /home/${user}/${project}

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /home/${user}/${project}/node_modules/.bin:$PATH

#COPY package.json /home/${user}/${project}/package.json
#RUN npm install --silent

# RUN npm init -y
# install express.js
RUN npm install express --save


#USER ${user}
EXPOSE 3000

# VOLUME /home/${user}/${project}
CMD bash
