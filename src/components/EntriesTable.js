import React from "react"
import Entry from "./Entry"
import PropTypes from "prop-types"

function EntriesTable(props) {
    return (
        <div className={"table entries__table"}>
            <div className={"table-row table-header"}>
                <div className={"table-cell"} data-header="Date">
                    <span
                        onClick={() => props.handleSort("timestamp")}
                        className={"table-cell-header-text"}
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
                    </span>
                </div>
                <div className={"table-cell"} data-header="Location">
                    <span
                        onClick={() => props.handleSort("location")}
                        className={"table-cell-header-text"}
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
                    </span>
                </div>
                <div className={"table-cell"} data-header="Download (Mbps)">
                    <span
                        onClick={() => props.handleSort("download")}
                        className={"table-cell-header-text"}
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
                    </span>
                </div>
                <div className={"table-cell"} data-header="Upload (Mbps)">
                    <span
                        onClick={() => props.handleSort("upload")}
                        className={"table-cell-header-text"}
                    >
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
                    </span>
                </div>
                <div className={"table-cell"} data-header="Ping (ms)">
                    <span
                        onClick={() => props.handleSort("ping")}
                        className={"table-cell-header-text"}
                    >
                        Ping (ms)
                        <span className=" icon has-text-info">
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
                    </span>
                </div>
            </div>
            {props.entries.map((entry, index) => {
                return (
                    <Entry
                        entry={entry}
                        key={entry.id}
                        city={props.city}
                        showNote={props.showNote}
                        sanitizeInputs={props.sanitizeInputs}
                        validateInputs={props.validateInputs}
                        cityCoordinates={props.cityCoordinates}
                    />
                )
            })}
        </div>
    )
}

EntriesTable.contextTypes = {
    authUser: PropTypes.object,
}

export default EntriesTable
