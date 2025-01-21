# Use official Node.js 22 image as base
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

COPY docker-compose*.yml ./

# Copy the rest of your application code
COPY . .

# Expose the port your app will run on
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:server"]
