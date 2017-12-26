# React Wifi Entries
A React App (bootstrapped using [Create React App](https://github.com/facebookincubator/create-react-app)) built to collect wifi speed tests for various coffee shops.

## Screenshots
The main app looks like this:
![main application screenshot](/screenshots/main.png)
The stats modal window looks like so:
![stats modal screenshot](/screenshots/stats.png)
## Local Development
If you'd like to run this project on your local machine run the following commands after you've cloned the repository to your local machine:
```bash
yarn install
yarn start
```
A browser window show automatically open at `http://localhost:3005/` where you should be able to view the app running.
## Deployment
The app is currently hosted on firebase at https://coffee-shop-wifi.firebaseapp.com/. To deploy the app make sure to run `yarn build` and then run `npm run deploy` and the firebase app should be updated.