FROM node:10

# Create app directory
WORKDIR /usr/src/notes-api

COPY . .

# Install dependencies
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
