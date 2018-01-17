import React from "react"
import Entry from "./Entry"
import PropTypes from "prop-types"

function EntriesTable(props) {
    return (
        <div className={"table entries__table"}>
            <div className={"table-row table-header"}>
                <div className={"table-cell"} data-header="Date">
                    <span
                        onClick={() =>
                            props.handleSort(
                                "timestamp",
                                props.sortOrder.timestamp,
                            )
                        }
                        className={"table-cell-header-text"}
                    >
                        Date
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sortOrder.timestamp ? "down" : "up")
                                }
                            />
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Location">
                    <span
                        onClick={() =>
                            props.handleSort(
                                "location",
                                props.sortOrder.location,
                            )
                        }
                        className={"table-cell-header-text"}
                    >
                        Location
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sortOrder.location ? "down" : "up")
                                }
                            />
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Download (Mbps)">
                    <span
                        onClick={() =>
                            props.handleSort(
                                "download",
                                props.sortOrder.download,
                            )
                        }
                        className={"table-cell-header-text"}
                    >
                        Download (Mbps)
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sortOrder.download ? "down" : "up")
                                }
                            />
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Upload (Mbps)">
                    <span
                        onClick={() =>
                            props.handleSort("upload", props.sortOrder.upload)
                        }
                        className={"table-cell-header-text"}
                    >
                        Upload (Mbps)
                        <span className="icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sortOrder.upload ? "down" : "up")
                                }
                            />
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Ping (ms)">
                    <span
                        onClick={() =>
                            props.handleSort("ping", props.sortOrder.ping)
                        }
                        className={"table-cell-header-text"}
                    >
                        Ping (ms)
                        <span className=" icon has-text-info">
                            <i
                                className={
                                    "fa fa-arrow-circle-" +
                                    (props.sortOrder.ping ? "down" : "up")
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
