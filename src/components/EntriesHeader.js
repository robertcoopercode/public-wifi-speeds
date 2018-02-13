import React from "react"
import styled from "styled-components"

import { media } from "../constants"

import MobileSort from "./MobileSort"

function EntriesHeader(props) {
    const Header = styled.div`
        margin-top: 10px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        ${media.medium`
            margin-top: 35px;
            flex-direction: row;
            justify-content: space-between;
        `};
    `
    const Title = styled.h2`
        margin: 10px 0;
        font-size: 1.5rem;
        text-align: center;

        ${media.small`
            font-size: 1.75rem;
            white-space: nowrap;
        `};
    `

    const Actions = styled.div`
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;

        ${media.small`
            flex-direction: row;
            flex-wrap: nowrap;
        `};
    `

    const Button = styled.button`
        margin: 5px 10px;

        ${media.small`
            &:first-child {
              margin-left: 0;
            };
            &:nth-child(2) {
              margin-right: 0;
            };
        `};
    `

    return (
        <Header>
            <Title>Wifi Speeds for {props.selectedCity}</Title>
            <Actions>
                <Button
                    className={"button is-primary"}
                    onClick={props.showEntryForm}
                >
                    Add New Entry
                </Button>
                <Button className={"button is-info"} onClick={props.showStats}>
                    Overall Stats
                </Button>
                {/* TODO: Add a conditional that only renders this on mobile/small screen widths */}
                <MobileSort
                    sort={props.sort}
                    handleSort={props.handleMobileSort}
                />
            </Actions>
        </Header>
    )
}

export default EntriesHeader
