import React, { Component, Fragment } from "react"
import {
    FacebookLoginButton,
    GoogleLoginButton,
    GithubLoginButton,
} from "react-social-login-buttons"
import * as firebase from "firebase"
import PropTypes from "prop-types"
import styled from "styled-components"
import { withRouter } from "react-router-dom"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

import { setUser } from "../actions"

const Login = styled.div`
    align-self: center;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
`
const Description = styled.p`
    font-size: 1.5rem;
    color: #ffffff;
    text-align: center;
`
const Error = styled.article`
    width: 600px;
    max-width: 100%;
    margin-bottom: 0 !important;
`
const LinkAccountsButton = styled.button`
    margin-top: 20px;
    margin-bottom: 10px;
`
const AuthenticationButtons = styled.div`
    margin: 1rem 0;
`
const CoffeeImage = styled.img`
    width: 80px;
    margin-top: 40px;
    display: block;
`

class LoginPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            pendingCred: null,
            provider: null,
            email: null,
        }
    }

    componentDidMount = () => {
        document.title = "Wifi Speeds - Login"
    }

    saveUser = user => {
        firebase
            .database()
            .ref("users/" + user.uid)
            .once("value")
            .then(snapshot => {
                const currentUser = {
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    admin: false,
                }

                // Set a new user in the database if the user doesn't already exist
                if (!snapshot.val()) {
                    firebase
                        .database()
                        .ref("users/" + user.uid)
                        .set(currentUser)
                }

                // Set the redux state with the current value found in the database
                this.props.setUser(snapshot.val())
            })
    }

    signin = providerName => {
        const provider = new firebase.auth[providerName + "AuthProvider"]()
        firebase
            .auth()
            .signInWithPopup(provider)
            .then(result => {
                this.saveUser(result.user)
                this.props.history.push("/")
            })
            .catch(error => {
                // An error happened.
                if (
                    error.code ===
                    "auth/account-exists-with-different-credential"
                ) {
                    // Step 2.
                    // User's email already exists.
                    // Save the pending account credential.
                    let pendingCred = error.credential
                    // The provider account's email address.
                    // Get registered providers for this email.
                    firebase
                        .auth()
                        .fetchProvidersForEmail(error.email)
                        .then(providers => {
                            // Step 3.
                            // Construct provider object for that provider.
                            let provider
                            let providerName
                            switch (providers[0]) {
                                case "google.com":
                                    providerName = "Google"
                                    provider = new firebase.auth[
                                        "GoogleAuthProvider"
                                    ]()
                                    break
                                case "facebook.com":
                                    providerName = "Facebook"
                                    provider = new firebase.auth[
                                        "FacebookAuthProvider"
                                    ]()
                                    break
                                case "github.com":
                                    providerName = "Github"
                                    provider = new firebase.auth[
                                        "GithubAuthProvider"
                                    ]()
                                    break
                                default:
                                    providerName = "another"
                            }
                            this.setState({
                                error:
                                    "This email is associated with a " +
                                    providerName +
                                    " account. Click on the button below to allow sign in from either provider.",
                                provider,
                                pendingCred,
                            })
                            // The user must now click on a button to proceed with the linking of accounts done under handleAccountLink()
                        })
                } else {
                    this.setState({
                        error: error.message,
                        provider: null,
                        pendingCred: null,
                    })
                }
            })
    }

    handleAccountLink = () => {
        firebase
            .auth()
            .signInWithPopup(this.state.provider)
            .then(result => {
                // Remember that the user may have signed in with an account that has a different email
                // address than the first one. This can happen as Firebase doesn't control the provider's
                // sign in flow and the user is free to login using whichever account he owns.
                //
                // Link to Acount credentials.
                // As we have access to the pending credential, we can directly call the linkWithCredential method.
                result.user
                    .linkWithCredential(this.state.pendingCred)
                    .then(() => {
                        // Account successfully linked to the existing Firebase user.
                        this.props.history.push("/")
                    })
            })
    }

    render() {
        return (
            <Login className="content">
                <Description>
                    Login with one of the following providers.
                </Description>
                {this.state.error ? (
                    <Fragment>
                        <Error className="message is-danger">
                            <div className="message-body">
                                {this.state.error}
                            </div>
                        </Error>
                        {this.state.pendingCred ? (
                            <LinkAccountsButton
                                className="button is-primary"
                                onClick={this.handleAccountLink}
                            >
                                Link Accounts
                            </LinkAccountsButton>
                        ) : null}
                    </Fragment>
                ) : null}
                <AuthenticationButtons>
                    <FacebookLoginButton
                        style={{
                            boxShadow: "none",
                            marginBottom: "10px",
                            width: "300px",
                        }}
                        onClick={() => this.signin("Facebook")}
                    />
                    <GoogleLoginButton
                        style={{
                            boxShadow: "none",
                            marginBottom: "10px",
                            width: "300px",
                        }}
                        onClick={() => this.signin("Google")}
                    />
                    <GithubLoginButton
                        style={{
                            boxShadow: "none",
                            marginBottom: "10px",
                            width: "300px",
                        }}
                        onClick={() => this.signin("Github")}
                    />
                </AuthenticationButtons>
                <p style={{ color: "#fff", marginTop: "0" }}>OR</p>
                <button
                    className="button  is-info"
                    onClick={() => this.props.history.push("/")}
                >
                    Go Home
                </button>
            </Login>
        )
    }
}

LoginPage.propTypes = {
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

export default withRouter(connect(null, mapDispatchToProps)(LoginPage))
