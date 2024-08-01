# Car Shipping Management System


## Getting Started

This instruction will get you a copy of this project up and running on your local machine

### Prerequisites

You need [Node JS](https://nodejs.org) (v18.x.x) installed on your local machine.

### Installing ⚙️

Run the followning command to install all the packages:

```sh
npm install
```

#### Setup Environment Variable

Set the following environment variable to `backend` directory. Also, an example file is given with the name of `.env.example`:

```
PORT = 8000
DATABASE_URL = "mysql://root:password@localhost:3306/databaseName"
JWT_SECRET = 'ANY_THING_YOU_LIKE'
BCRYPT_SALT_OR_ROUNDS = 10

```


### Database Migration 💿

Run the followning command to migrate the prisma schema:

```sh
npm run prisma:migrate
```

You only have to run this for only one time at the beginning of project setup





By this command your app and server will be run concurrently

```sh
npm start
```

An server will be run at http://localhost:8000 <br/>


## Authors

-   **Fahad Hassan** - _Software Engineer_