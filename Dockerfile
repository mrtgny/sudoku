FROM node:8 as react-build
WORKDIR /usr/src/app
COPY . ./
RUN yarn
CMD ["npm", "start"]
