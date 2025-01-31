# Northcoders News API

To be able to run the API (Application Programming Interface) in this repo you will have to allow the connection to take place.

There are 2 databases that you can access, one test database that has all the testing related to the functionalities of the database, and a developer database that doesn't have the tests which the user can interact with safely.

If you only wish to have access to the dev database please follow these steps:

1. Fork this repository on your profile.

2. Open your local terminal in your preferred CLI. Make sure you are in your Home directory and type in the terminal git clone URL-of-your-nc-news-repo.

3. Move inside the main directory of the repository. Remember: your filepath on the terminal should end with /be-nc-news

4. Create a gitignore file that will allow you to store a command. This command will allow you to store an environmental variable to access the commands and run the API on the dev database. The commands are provided in the package.json file under the "script" property. Type touch .env.development to create file.

5. Look at the text file of .env.example in the main directory and get the correct database name in the setup.sql file in the db folder. Enter this into your .env file

6. Once done this please run the command npm i. This will install the packages you need to run this API. To make sure the environment variables are working install dotenv program by typing install dotenv.

If you wish to have access to the test database please follow these steps:

1. Follow steps 1-4 but at step 4 create a file of .env.test and choose on step 5 the correct database name ending in \_test.

# be-nc-news

## Hosted Version

A live version of this project can be accessed here: [Your Hosted Link]

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

#### 1. Clone the repository

```bash
git clone https://github.com/dublino8576/nc-news.git
cd be-nc-news
```

#### 2. Install dependencies

```bash
npm install
npm install dovenv --save
npm install express
npm install pg
npm install pg-format
```

These 3 dependencies are essential for both testing and development database to run. **npm install** should load all the dependecies needed but it might be needed to install them manually with those commands.

If you are also running the test database you want to make sure you run the following commands to make sure the dev dependencies are uploaded in your local repository. You can also install husky if you wish to do some contributions as part of your Continuous Integration process when submit a pull request to avoid broken code pushed to the main branch in GitHub.

```bash
npm install --save-dev jest
npm install --save-dev husky
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

By default, the server will run on `http://localhost:3000/`

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
