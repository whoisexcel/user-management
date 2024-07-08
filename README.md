This is a User Management Application built with Nestjs, Postgress, Typescript and Typeorm.

After the application is cloned, use command `npm install` to install dependencies. Create a `.env` file for connection to postgress database. The sample for the keys required for db connection is shown in `.env.sample` file.

RUN `npm run start` to start the application.

Once the application is started, you will be able to access the swagger documentation on `http://localhost:3000/api` 

command `docker-compose up --build` to spin up docker

There is currently a migration file in the application with queries for database migration. If you want to do your own migration, use `npm run typeorm:create-migration` to generate migration file and `npm run typeorm:run-migrations` command to run the query against the db and `npm run typeorm:revert-migrations` to revert database changes.

Command  `npm run test` runs the unit tests.