import React from "react"
import styled from "styled-components"

function HomeContent(props) {
    const Content = styled.div`
        margin-top: 40px;
    `
    return (
        <Content className="content">
            <p>
                Welcome! This web app is used to collect information regarding
                wifi speeds for public places (such as coffee shops, airports,
                libraries, etc. The best way to get the wifi speed for a network
                that you are connected to is to use{" "}
                <a
                    href="http://www.speedtest.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    this online speed test
                </a>. Eventually, we hope to incorporate a speedtest tool right
                in this website.
            </p>
            <p>
                We currently only have the option to add entries for locations a
                few canadian cities found in the dropdown menu, but hope to
                allow people to add other cities in the future.
            </p>
        </Content>
    )
}

export default HomeContent
