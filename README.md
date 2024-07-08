This is a User Management Application built with Nestjs, Postgress and Typescript.

After the application is cloned, use command `npm install` to install dependencies. Create a `.env` file for connection to postgress database. The sample for the values required for database connection is shown in `.env.sample` file.

RUN `npm run start` to start the application.

Once the application is started, you will be able to access the swagger documentation on `http://localhost:3000/api`- where you will find information on how to test the endpoints. An admin will be seeded in the database when you run the application. This was done for access to a certain endpoint. Credentials for the admin user are in the `seeder.service.ts` file. Also note that every endpoint asides from creating a user(/api/users?) requires a token which will be generated at login. Copy this token and pass it as header for subsequent request.

command `docker-compose up --build` to spin up docker

There is a migration file in the application with queries for database migration. If you want to do your own migration, use `npm run typeorm:create-migration` to generate migration file, `npm run typeorm:run-migrations` command to run the query against the database and `npm run typeorm:revert-migrations` to revert database changes.

Command  `npm run test` runs the unit tests.

