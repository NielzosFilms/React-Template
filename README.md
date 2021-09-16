# Setup

This is a template used to setup a React App.

## Used libraries

-   Node JS
-   React
-   Sequelize
-   Material-UI
-   Graphql

## Features

-   Authentication
-   Crud table
-   Query provider

## Start guide

Install `node_modules`:

    yarn install

The `.env` file is provided (change if needed), the database name is `bit_bloemenhandel`

Also change the config in `./config/config.json` for your database

After that migrate and seed the database

    yarn sequelize-cli db:migrate

    yarn sequelize-cli db:seed:all

That is everything setup!

To run the app, run 2 terminals

Terminal 1:

    yarn start

Terminal2:

    yarn start:server

The default user,

Username:
admin

Password:
asdf
