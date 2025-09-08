# Dockerfile for Next.js Pizza Builder App

# 1. Base Image: Use an official Node.js image.
# Using a specific version ensures consistency. Alpine versions are smaller.
FROM node:18-alpine AS base

# 2. Set Working Directory
WORKDIR /app

# 3. Install Dependencies
# First, copy over package.json and package-lock.json to leverage Docker's build cache.
COPY package*.json ./
# Install dependencies, including Prisma client generation
RUN npm install

# 4. Copy Application Code
# Copy the rest of the application code into the container.
COPY . .

# 5. Generate Prisma Client
# Ensure the Prisma client is generated for the correct database provider (PostgreSQL)
RUN npx prisma generate

# 6. Build the Next.js Application
# This creates an optimized production build.
RUN npm run build

# 7. Production Image
# Use a smaller, more secure base image for the final production container.
FROM node:18-alpine AS production

WORKDIR /app

# Copy over the built application from the 'base' stage.
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma

# 8. Expose Port and Start the App
# The Next.js app will run on port 3000 by default.
EXPOSE 3000
CMD ["npm", "start"]
