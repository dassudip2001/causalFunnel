FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN  npm run build 

FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]