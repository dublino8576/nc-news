# Northcoders News API

To be able to run the API (Application Programming Interface) in this repo you will have to allow the connection to take place.

There are 2 databases that you can access, one test database that has all the testing related to the functionalities of the database, and a developer database that doesn't have the tests which the user can interact with safely.

If you only wish to have access to the dev database please follow these steps:

1. Fork this repository on your profile.

2. Open your local terminal in your preferred CLI. Make sure you are in your Home directory and type in the terminal git clone URL.

3. Move inside the main directory of the repository. Remember: your filepath on the terminal should end with /be-nc-news

4. Create a gitignore file that will allow you to store a command. This command will allow you to store an environmental variable to access the commands and run the API on the dev database. The commands are provided in the package.json file under the "script" property. Type touch .env.development to create file.

5. Look at the text file of .env.example in the main directory and get the correct database name in the setup.sql file in the db folder. Enter this into your .env file

6. Once done this please run the command npm i. This will install the packages you need to run this API. To make sure the environment variables are working install dotenv program by typing install dotenv.

If you wish to have access to the test database please follow these steps:

1. Follow steps 1-4 but at step 4 create a file of .env.test and choose on step 5 the correct database name ending in \_test.

---
