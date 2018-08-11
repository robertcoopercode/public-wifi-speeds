import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { media, colors } from "../constants"

import Entry from "./Entry"

function EntriesTable(props) {
    const Table = styled.div`
        margin: 0 !important;
        margin-top: 15px !important;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        border: 1px solid #2d365b;
        font-size: 1rem;
        margin: 0.5rem;
        line-height: 1.5;
        background: none;
    `
    const Row = styled.div`
        position: relative;
        width: 100%;
        border: 2px solid black;
        border-bottom: none;
        &:nth-of-type(even) {
            background-color: ${colors.darkTableRow};
        }
        &:nth-of-type(odd) {
            background-color: ${colors.lightTableRow};
        }
        &:nth-of-type(1) {
            background-color: #ffdd57;
        }

        ${media.medium`
            border: none;
            display: flex;
            flex-flow: row nowrap;
            &:nth-of-type(even) {
            background-color: $light-color;
            }
            &:nth-of-type(odd) {
            background-color: $dark-color;
            }
            &:nth-of-type(1) {
            background-color: #ffdd57;
            }
        `};
    `
    const Header = Row.extend`
        display: none;

        ${media.medium`
            font-weight: 700;
            background-color: ${colors.darkTableRow};
        `};
    `
    const Cell = styled.div`
        display: flex;
        position: relative;
        flex-wrap: nowrap;
        flex-direction: row;
        padding: 0 !important;
        word-break: break-word;
        line-height: 1.5;
        border-bottom: 1px solid black;

        &[data-header="Location"] {
            flex-grow: 3;
        }
        &:before {
            content: attr(data-header);
            width: 40%;
            font-weight: 700;
            display: flex;
            align-items: center;
            padding: 10px;
            background-color: #ffdd57;
            ${media.small`
                width: 30%;
              `};
        }
        ${media.medium`
                border: 1px solid #2D365B;
              padding: 0.5em;
              flex-grow: 1;
              flex-basis: 0;
              &:before {
                content: none;
              }
            `};
    `
    const HeaderCellText = styled.span`
        padding: 0.5em;
        width: 100%;
        &:hover {
            cursor: pointer;
        }
    `
    return (
        <Table className="table">
            <Header>
                <Cell data-header="Date">
                    <HeaderCellText
                        onClick={() => props.handleSort("timestamp")}
                    >
                        Date
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sort.lastSorted === "timestamp" &&
                                    props.sort.currentOrder.timestamp ===
                                        "descending"
                                        ? "down"
                                        : "up")
                                }
                            />
                        </span>
                    </HeaderCellText>
                </Cell>
                <Cell data-header="Location">
                    <HeaderCellText
                        onClick={() => props.handleSort("location")}
                    >
                        Location
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sort.lastSorted === "location" &&
                                    props.sort.currentOrder.location ===
                                        "descending"
                                        ? "down"
                                        : "up")
                                }
                            />
                        </span>
                    </HeaderCellText>
                </Cell>
                <Cell data-header="Download (Mbps)">
                    <HeaderCellText
                        onClick={() => props.handleSort("download")}
                    >
                        Download (Mbps)
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sort.lastSorted === "download" &&
                                    props.sort.currentOrder.download ===
                                        "descending"
                                        ? "down"
                                        : "up")
                                }
                            />
                        </span>
                    </HeaderCellText>
                </Cell>
                <Cell data-header="Upload (Mbps)">
                    <HeaderCellText onClick={() => props.handleSort("upload")}>
                        Upload (Mbps)
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sort.lastSorted === "upload" &&
                                    props.sort.currentOrder.upload ===
                                        "descending"
                                        ? "down"
                                        : "up")
                                }
                            />
                        </span>
                    </HeaderCellText>
                </Cell>
                <Cell data-header="Ping (ms)">
                    <HeaderCellText onClick={() => props.handleSort("ping")}>
                        Ping (ms)
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sort.lastSorted === "ping" &&
                                    props.sort.currentOrder.ping ===
                                        "descending"
                                        ? "down"
                                        : "up")
                                }
                            />
                        </span>
                    </HeaderCellText>
                </Cell>
            </Header>
            {props.entries.map((entry, index) => {
                return (
                    <Entry
                        key={entry.id}
                        entry={entry}
                        city={props.city}
                        showNote={props.showNote}
                        sanitizeInputs={props.sanitizeInputs}
                        validateInputs={props.validateInputs}
                        cityCoordinates={props.cityCoordinates}
                    />
                )
            })}
        </Table>
    )
}

EntriesTable.contextTypes = {
    authUser: PropTypes.object,
}

export default EntriesTable
