# Northcoders News API

## Hosted Version

A live version of this project can be accessed here: [live Northcoders News API](https://nc-news-with-comments-project.onrender.com)
You can then add the endpoint to this URL to an API development Platform like Insomnia [download Insomnia](https://insomnia.rest/download) or fetch the result from the GET requests on your browser.

## Project Summary

be-nc-news is a RESTful API built with Node.js and Express.js, serving as the backend for a news aggregation site. It provides endpoints to interact programmatically with articles, users, comments, and topics stored in a PostgreSQL database, so that we can access
The file **endpoint.json** in the root of the repository outlines all the requests available for of each endpoint and their features.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (minimum version: **23.3.x**)
- **PostgreSQL** (minimum version: **16.6.x**)

### Installation & Setup

#### 1. Fork this repo, clone it locally and move inside the root directory

```bash
git clone https://github.com/dublino8576/nc-news.git
cd be-nc-news
```

#### 2. Install the dependencies

```bash
npm install
npm install dovenv --save
npm install express
npm install pg
npm install pg-format
```

These 4 dependencies are essential for both testing and development database to run. **npm install** should load all the dependecies needed but it might be needed to install them manually with those commands.

If you are also running the test database you want to make sure you run the following commands to make sure the dev dependencies are uploaded in your local repository. You can also install husky with using script "prepare" if you wish to do some contributions as part of your Continuous Integration process when submit a pull request to avoid broken code pushed to the main branch in GitHub.

```bash
npm install --save-dev jest
npm run prepare
npm install --save-dev jest-sorted
npm install supertest --save-dev

```

#### 3. Set up the databases

Run the following command to create the required databases:

```bash
npm run setup-dbs
```

#### 4. Create environment variable files

You need to create two `.env` files in the root directory:

- **.env.development**

```
PGDATABASE=nc_news
```

- **.env.test**

```
PGDATABASE=nc_news_test
```

These files are required to connect to the correct PostgreSQL databases.

#### 5. Seed the database

For development:

```bash
npm run seed-dev
```

For testing:

```bash
npm run seed-test
```

#### 6. Start the server

```bash
npm start
```

This will run the listen.js file. By default, the server will run on `http://localhost:3000/`

### Running Tests

To run the test suite, execute:

```bash
npm test
```

## Additional Information

- **Repository**: [GitHub Repo](https://github.com/northcoders/be-nc-news)
- **Issues**: [Report an Issue](https://github.com/northcoders/be-nc-news/issues)

For any further questions or contributions, feel free to fork the repository and submit a pull request!

---
