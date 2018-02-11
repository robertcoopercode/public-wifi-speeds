import React from "react"
import PropTypes from "prop-types"

function HomeContent(props) {
    return (
        <div className="home__content content">
            <p>
                Welcome! This web app is used to collect information regarding
                wifi speeds for public places (such as coffee shops, airports,
                libraries, etc. The best way to get the wifi speed for a network
                that you are connected to is to use{" "}
                <a href="http://www.speedtest.net/" target="_blank">
                    this online speed test
                </a>. Eventually, we hope to incorporate a speedtest tool right
                in this website.
            </p>
            <p>
                We currently only have the option to add entries for locations a
                few canadian cities found in the dropdown menu, but hope to
                allow people to add other cities in the future.
            </p>
        </div>
    )
}

HomeContent.propTypes = {}
HomeContent.defaultProps = {}

export default HomeContent
