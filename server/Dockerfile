FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Bundle app source
COPY . .

# Create uploads directory for fallback storage
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Run the app
CMD [ "node", "server.js" ]
