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
            error: null
        }
    }

    componentDidMount = () => {
        document.title = "Wifi Speeds - Login"
    }

    signin = (providerName) => {
        const provider = new firebase.auth[providerName + "AuthProvider"]();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            this.setState({
                user: result.user
            })
            this.props.history.push('/');
        }.bind(this)).catch(function(error) {
            this.setState({error: error.message})
        }.bind(this));
    }

    render() {
        return (
            <div className="login content">
                <p className={"login__text"}>Login with one of the following providers.</p>
                {this.state.error ?
                    <article className="message is-danger">
                        <div className="message-body">
                            {this.state.error}
                        </div>
                    </article>
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
