<h1 align="center">
  <br>
  Gan-Hattra Rest API
  <br>
  <br>
</h1>

<p align="center">
  <a href="https://travis-ci.org/rayandrews/gan-hattra-api"><img alt="build status" src="https://api.travis-ci.org/rayandrews/gan-hattra-api.svg?branch=master" /></a>
  <a href="https://codecov.io/gh/rayandrews/gan-hattra-api">
    <img src="https://codecov.io/gh/rayandrews/gan-hattra-api/branch/master/graph/badge.svg" />
  </a>
  <a href="https://github.com/xojs/xo">
    <img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="XO Code Style">
  </a>
  <a href="https://github.com/Flet/semistandard"><img src="https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square" alt="JS Semistandard Style"></a>
</p>

<p align="center">
  This repository contains the backend/REST API server of the Gan-Hattra Project.
</p>

<p align="center">
  Code Quality : <a href="https://sonarcloud.io/dashboard?id=gan-hattra-api">SonarQube</a>
</p>

---

## Installation

## Running using Docker

Prerequisites: [Docker Engine](https://docs.docker.com/engine/installation/) and [Docker Compose](https://docs.docker.com/compose/install/) __must be installed__;

Internet access for pulling gradle dependencies and Docker images.

**Note: Docker commands might need root privileges/sudo.**

---

### Development

1. Clone this repo
2. Navigate to the project directory.
3. Run `docker-compose build`.
4. Run `docker-compose up -d`.
5. Voila you're done running docker!

|   Port  |      Used       |
|:-------:|:---------------:|
|   3000  |    Express JS   |
|   1000  |    PHPMyAdmin   |
|   1001  | RethinkDB Admin |

#### Notes for development

- To stop the containers, do `docker-compose stop`
- If the Dockerfile is modified, you will need to rebuild the Docker images by removing the containers and running `docker-compose build` again
- To remove the containers, run `docker-compose down`

---

### Testing

1. Clone this repo
2. Navigate to the project directory.
3. Run `docker-compose -f docker-compose.test.yml build`.
4. Run `docker-compose -f docker-compose.test.yml up -d`.
5. Voila open up your reports folder to see coverage and test result

Tools : Mocha, Chai, Sinon, Istanbul, Codecov

#### Notes for testing

- To stop the containers, do `docker-compose -f docker-compose.test.yml stop`
- If the Dockerfile is modified, you will need to rebuild the Docker images by removing the containers and running `docker-compose -f docker-compose.test.yml build` again
- To remove the containers, run `docker-compose -f docker-compose.test.yml down`

---

### Production

1. Clone this repo
2. Navigate to the project directory.
3. Run `docker-compose -f docker-compose.production.yml build`.
4. Run `docker-compose -f docker-compose.production.yml up -d`.
5. Voila you're done running docker!

|   Port  |         Used            |
|:-------:|:-----------------------:|
|   3000  |   Nginx Reverse Proxy   |
|   3001  |       PHPMyAdmin        |

#### Notes for production

- To stop the containers, do `docker-compose -f docker-compose.production.yml stop`
- If the Dockerfile is modified, you will need to rebuild the Docker images by removing the containers and running `docker-compose -f docker-compose.production.yml build` again
- To remove the containers, run `docker-compose -f docker-compose.production.yml down`

---

### General notes

- Run `docker ps` to see running containers. Take note of the name of the container running the app service.

---

## Keynote

TO BE ADDED

