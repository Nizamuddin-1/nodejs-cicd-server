# ==============================================================================
# Dockerfile for Node.js Application (Jenkins CI/CD & Docker Ready)
# ==============================================================================

# Step 1: Use an official Node.js LTS Alpine image for a lightweight base image
FROM node:20-alpine

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json first
# (This leverages Docker layer caching so npm install only runs when dependencies change)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci || npm install

# Step 5: Copy the rest of the application source code into the container
COPY . .

# Step 6: Define environment variables
ENV NODE_ENV=production
ENV PORT=80

# Step 7: Expose port 80 (the port our Express server listens on by default)
EXPOSE 80

# Step 8: Define the command to start the app
CMD ["node", "index.js"]
