# Public Wifi Entries
An application used to record wifi speeds at public locations. Built with React on the front end and Firebase for the database, authentication, and hosting.

![main application screenshot](/screenshots/main.png)

## Local Development
In the root project directory, install all the project dependencies:

#### `yarn install`

Next, you will need to rename the `.env.example` file to `.env` to have access to the required environment varibles. The environment variables allow the application to work with Firebase as well as use the Google Places API.
 
Once that is complete, start the development server:

#### `yarn start`

The application should now be running on [http://localhost:3000/](http://localhost:3000/).

## Deployment
To deploy the application, first run the build command in the root project directory:

#### `yarn build`

Then, deploy the application to firebase:

#### `firebase deploy`

> Note: you need the production API values in your `.env` file to properly deploy the application to firebase

The live app should be available at [https://publicwifispeeds.firebaseapp.com/](https://publicwifispeeds.firebaseapp.com/).