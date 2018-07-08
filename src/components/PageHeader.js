import React from "react"
import styled from "styled-components"
import { withRouter } from "react-router-dom"

import CitySelection from "./CitySelection"

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`

class PageHeader extends React.Component {
    render() {
        return (
            <Header>
                <CitySelection />
                {this.props.authUser ? (
                    <button
                        className="button is-danger"
                        onClick={this.props.signout}
                    >
                        Sign Out
                    </button>
                ) : (
                    <button
                        className="button is-info"
                        onClick={() => this.props.history.push("/login")}
                    >
                        Sign In
                    </button>
                )}
            </Header>
        )
    }
}

export default withRouter(PageHeader)
