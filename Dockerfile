FROM node:8

LABEL Author="Alex Gomez <khabaznak@gmail.com>"

ARG user=xpress
ARG group=xpress
ARG project=wikirace


# set working directory
RUN mkdir -p /home/${user}/${project}
WORKDIR /home/${user}/${project}
# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /home/${user}/${project}/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
COPY . .

#USER ${user}
RUN npm install express --save

EXPOSE 8080

# VOLUME /home/${user}/${project}
CMD bash
