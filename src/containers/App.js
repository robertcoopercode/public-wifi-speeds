import * as firebase from "firebase"
import React, { Fragment } from "react"
import "bulma/css/bulma.css"
import { Route } from "react-router-dom"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import "../App.css"
import HomePage from "./HomePage"
import LoginPage from "./LoginPage"
import { setUser } from "../actions"

class App extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(authUser => {
            if (authUser) {
                firebase
                    .database()
                    .ref("users/" + authUser.uid)
                    .once("value")
                    .then(snapshot => {
                        this.props.setUser(snapshot.val())
                    })
            }
            this.props.setUser(null)
        })
    }
    render() {
        return (
            <Fragment>
                <Route
                    exact
                    path="/"
                    // render={() => <HomePage authUser={authUser} />}
                    render={() => <HomePage />}
                />
                <Route path="/login" component={LoginPage} />
            </Fragment>
        )
    }
}

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators(
        {
            setUser: setUser,
        },
        dispatch,
    )
}

export default withRouter(connect(null, mapDispatchToProps)(App))
