import React, { Component } from "react"
import PropTypes from "prop-types"

import MobileSort from "./MobileSort"

function EntriesHeader(props) {
    return (
        <div className={"home__summary-section summary-section"}>
            <h2 className={"summary-section__title"}>
                Wifi Speeds for {props.selectedCity}
            </h2>
            <div className={"summary-section__actions"}>
                <button
                    className={
                        "summary-section__action-button button is-primary"
                    }
                    onClick={props.showEntryForm}
                >
                    Add New Entry
                </button>
                <button
                    className={"summary-section__action-button button is-info"}
                    onClick={props.showStats}
                >
                    Overall Stats
                </button>
                <MobileSort
                    sort={props.sort}
                    handleSort={props.handleMobileSort}
                />
            </div>
        </div>
    )
}

EntriesHeader.propTypes = {}
EntriesHeader.defaultProps = {}

export default EntriesHeader
