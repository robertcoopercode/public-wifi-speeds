import React, { Fragment } from "react"
import "bulma/css/bulma.css"
import "../App.css"
import withAuthentication from "./withAuthentication"
import HomePage from "./HomePage"
import LoginPage from "./LoginPage"
import { Route } from "react-router-dom"
import PropTypes from "prop-types"

function App() {
    return (
        <Fragment>
            <Route exact path="/" render={() => <HomePage />} />
            <Route path="/login" component={LoginPage} />
        </Fragment>
    )
}

App.contextTypes = {
    authUser: PropTypes.object,
}

export default withAuthentication(App)
