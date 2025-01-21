# Use Ubuntu 22.04 as a base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    && curl -sL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && apt-get install -y build-essential \
    && apt-get install -y python3 \
    && apt-get install -y git \
    # Install FFmpeg
    && apt-get install -y ffmpeg

# Install TypeScript globally
RUN npm install -g typescript
# Install PM2 globally
RUN npm install -g pm2 pm2-runtime

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
COPY docker-compose*.yml ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port the app will run on
EXPOSE 4000

# Run the application
CMD ["npm", "run", "start:server"]
