# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /
RUN useradd -m nodeuser
RUN apt-get update && apt-get install -y jq
COPY package.json package.json
RUN npm install
EXPOSE 3000
EXPOSE 8000
COPY secrets.sh /bin/secrets.sh
COPY bws /bin/bws
COPY main.js /main/main.js
COPY common.js /main/common.js
COPY wikialbums.js /main/wikialbums.js
COPY startup.sh /main/startup.sh
COPY rotatestring.sh /main/rotatestring.sh
CMD ["/main/startup.sh"]
ENTRYPOINT ["/bin/bash", "/main/startup.sh"]
