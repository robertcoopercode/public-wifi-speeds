import * as firebase from "firebase"
import PropTypes from "prop-types"
import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { setUser } from "../actions"

export const AuthContext = React.createContext(null)

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                authUser: null,
            }
        }

        componentDidMount() {
            firebase.auth().onAuthStateChanged(authUser => {
                if (authUser) {
                    this.setState(() => ({ authUser }))
                    firebase
                        .database()
                        .ref("users/" + authUser.uid)
                        .once("value")
                        .then(snapshot => {
                            this.props.setUser(snapshot.val())
                        })
                } else {
                    this.setState(() => ({ authUser: null }))
                }
            })
        }
        render() {
            return (
                <AuthContext.Provider value={this.state.authUser}>
                    <Component />
                </AuthContext.Provider>
            )
        }
    }

    withAuthentication.propTypes = {
        setUser: PropTypes.func,
    }

    const mapDispatchToProps = function(dispatch) {
        return bindActionCreators(
            {
                setUser: setUser,
            },
            dispatch,
        )
    }

    return connect(null, mapDispatchToProps)(WithAuthentication)
}

export default withAuthentication
