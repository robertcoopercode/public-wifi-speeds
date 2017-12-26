import React from 'react'
import '../App.css'
import 'bulma/css/bulma.css'
import withAuthentication from './withAuthentication'
import Home from './Home'
import Login from './Login'
import { Route } from 'react-router-dom'
import PropTypes from 'prop-types'

const App = (props, { authUser }) =>
  <React.Fragment>
    <Route exact path="/" render={() => <Home />}/>
    <Route path="/login" component={Login}/>
  </React.Fragment>

App.contextTypes = {
    authUser: PropTypes.object,
};

export default withAuthentication(App);
