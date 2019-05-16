FROM node:12.1.0-alpine

WORKDIR /opt/app

COPY node_modules/ node_modules/
COPY dist/ dist/

EXPOSE 8081
CMD ["node", "dist/main.js"]
