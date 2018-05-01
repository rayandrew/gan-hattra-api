FROM node:9-alpine

RUN yarn config set no-progress true

# Create app directory and set as working directory
RUN mkdir -p /usr/src/e-gov-jabar
RUN chown -R node:node /usr/src/e-gov-jabar
WORKDIR /usr/src/e-gov-jabar

# Use default node (non-root) user
USER node

# Install app dependencies (done before copying app source to optimize caching)
COPY ["package.json", "package-lock.json", "npm-shrinkwrap.json*", "yarn.lock*", "/usr/src/e-gov-jabar/"]

RUN yarn

# Copy app source to container
COPY --chown=node:node . /usr/src/e-gov-jabar

EXPOSE 3000
CMD ["yarn", "start"]


