import React, { Component } from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import CitySelection from "./CitySelection"

function PageHeader(props) {
    const Header = styled.div`
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    `
    return (
        <Header>
            <CitySelection />
            <button className="button is-danger" onClick={props.signout}>
                Sign Out
            </button>
        </Header>
    )
}

PageHeader.propTypes = {}
PageHeader.defaultProps = {}

export default PageHeader
