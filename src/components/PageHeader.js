import React, { Component } from "react"
import CitySelection from "./CitySelection"
import PropTypes from "prop-types"

function PageHeader(props) {
    return (
        <div className={"home__top-section"}>
            <CitySelection />
            <button
                className="home__logout-button button is-danger"
                onClick={props.signout}
            >
                Sign Out
            </button>
        </div>
    )
}

PageHeader.propTypes = {}
PageHeader.defaultProps = {}

export default PageHeader
