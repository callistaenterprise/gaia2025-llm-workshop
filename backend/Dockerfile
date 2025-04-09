# Stage 1: Build the application
FROM node:22 AS builder

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install TypeScript globally if needed
#RUN npm install -g typescript

# Build the TypeScript application
RUN npm run build


# Stage 2: Production image
FROM node:22-alpine AS production

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy only the build output and necessary files from the builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/.env.* ./
COPY --from=builder /usr/src/app/dist/src ./

# Install production dependencies
RUN npm install --only=production

# Expose the port your app runs on (e.g., 3000 for Express)
EXPOSE 3000

# Start the Node.js server
CMD ["node", "index.js"]
