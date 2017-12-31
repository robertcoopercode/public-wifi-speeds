import React, { Component } from 'react';
import {
    FacebookLoginButton,
    GoogleLoginButton,
    TwitterLoginButton,
    GithubLoginButton
} from 'react-social-login-buttons';
import * as firebase from 'firebase';

class Login extends Component {
    constructor(props) {
        super(props);
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

    signin = (providerName) => {
        const provider = new firebase.auth[providerName + "AuthProvider"]();
        firebase.auth().signInWithPopup(provider).then((result) => {
            this.setState({
                user: result.user
            })
            this.props.history.push('/');
        }).catch((error) => {
            // An error happened.
            if (error.code === 'auth/account-exists-with-different-credential') {
                // Step 2.
                // User's email already exists.
                // The pending Facebook credential.
                let pendingCred = error.credential;
                // The provider account's email address.
                // Get registered providers for this email.
                firebase.auth().fetchProvidersForEmail(error.email).then((providers) => {
                    // Step 3.
                    // Construct provider object for that provider.
                    // TODO: implement getProviderForProviderId.
                    let provider;
                    let providerName;
                    switch(providers[0]) {
                        case "google.com":
                            providerName = "Google";
                            provider = new firebase.auth["GoogleAuthProvider"]();
                            break;
                        case "facebook.com":
                            providerName = "Facebook";
                            provider = new firebase.auth["FacebookAuthProvider"]();
                            break;
                        case "github.com":
                            providerName = "Github";
                            provider = new firebase.auth["GithubAuthProvider"]();
                            break;
                        default:
                            providerName = "another"
                    }
                    this.setState({
                        error: "This email is associated with a " + providerName + " account. Click on the button below to allow sign in from either provider.",
                        provider,
                        pendingCred
                    })
                    // At this point, you should let the user know that he already has an account
                    // but with a different provider, and let him validate the fact he wants to
                    // sign in with this provider.
                    // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                    // so in real scenario you should ask the user to click on a "continue" button
                    // that will trigger the signInWithPopup.
                });
            } else {
                this.setState({
                    error: error.message,
                    provider: null,
                    pendingCred: null
                })
            }
        });
    }

    handleAccountLink = () => {
        firebase.auth().signInWithPopup(this.state.provider).then((result) => {
            // Remember that the user may have signed in with an account that has a different email
            // address than the first one. This can happen as Firebase doesn't control the provider's
            // sign in flow and the user is free to login using whichever account he owns.
            // Step 4b.
            // Link to Facebook credential.
            // As we have access to the pending credential, we can directly call the link method.
            result.user.linkWithCredential(this.state.pendingCred).then(() => {
                // Facebook account successfully linked to the existing Firebase user.
                this.props.history.push('/');
            });
        });
    }

    render() {
        return (
            <div className="login content">
                <p className={"login__text"}>Login with one of the following providers.</p>
                {this.state.error ?
                    <React.Fragment>
                        <article className="login__error message is-danger">
                            <div className="message-body">
                                {this.state.error}
                            </div>
                        </article>
                        {this.state.pendingCred ?
                            <button className="login__link-accounts button is-primary" onClick={this.handleAccountLink}>Link Accounts</button>
                            :
                            null
                        }
                    </React.Fragment>
                :
                null}
                <div className="login__authentication-buttons">
                    <FacebookLoginButton style={{"boxShadow": "none", "marginBottom": "10px", "width": "300px"}} onClick={() => this.signin("Facebook")} />
                    <GoogleLoginButton style={{"boxShadow": "none", "marginBottom": "10px", "width": "300px"}} onClick={() => this.signin("Google")} />
                    <TwitterLoginButton style={{"boxShadow": "none", "marginBottom": "10px", "width": "300px"}} onClick={() => this.signin("Twitter")} />
                    <GithubLoginButton style={{"boxShadow": "none", "marginBottom": "10px", "width": "300px"}} onClick={() => this.signin("Github")} />
                </div>
                <img className={"login__coffee"} src={"/coffee.png"} alt={"steaming coffee"}/>
            </div>
        );
    }
}

export default Login;
