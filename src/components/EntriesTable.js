import React, { Component } from "react"
import Entry from "./Entry"
import PropTypes from "prop-types"

class EntriesTable extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={"table entries__table"}>
                <div className={"table-row table-header"}>
                    <div className={"table-cell"} data-header="Date">
                        <span
                            onClick={() =>
                                this.props.handleSort(
                                    "timestamp",
                                    this.props.sortOrder.timestamp,
                                )
                            }
                            className={"table-cell-header-text"}
                        >
                            Date
                            <span className="icon has-text-info">
                                <i
                                    className={
                                        "fa fa-arrow-circle-" +
                                        (this.props.sortOrder.timestamp
                                            ? "down"
                                            : "up")
                                    }
                                />
                            </span>
                        </span>
                    </div>
                    <div className={"table-cell"} data-header="Location">
                        <span
                            onClick={() =>
                                this.props.handleSort(
                                    "location",
                                    this.props.sortOrder.location,
                                )
                            }
                            className={"table-cell-header-text"}
                        >
                            Location
                            <span className="icon has-text-info">
                                <i
                                    className={
                                        "fa fa-arrow-circle-" +
                                        (this.props.sortOrder.location
                                            ? "down"
                                            : "up")
                                    }
                                />
                            </span>
                        </span>
                    </div>
                    <div className={"table-cell"} data-header="Download (Mbps)">
                        <span
                            onClick={() =>
                                this.props.handleSort(
                                    "download",
                                    this.props.sortOrder.download,
                                )
                            }
                            className={"table-cell-header-text"}
                        >
                            Download (Mbps)
                            <span className="icon has-text-info">
                                <i
                                    className={
                                        "fa fa-arrow-circle-" +
                                        (this.props.sortOrder.download
                                            ? "down"
                                            : "up")
                                    }
                                />
                            </span>
                        </span>
                    </div>
                    <div className={"table-cell"} data-header="Upload (Mbps)">
                        <span
                            onClick={() =>
                                this.props.handleSort(
                                    "upload",
                                    this.props.sortOrder.upload,
                                )
                            }
                            className={"table-cell-header-text"}
                        >
                            Upload (Mbps)
                            <span className="icon has-text-info">
                                <i
                                    className={
                                        "fa fa-arrow-circle-" +
                                        (this.props.sortOrder.upload
                                            ? "down"
                                            : "up")
                                    }
                                />
                            </span>
                        </span>
                    </div>
                    <div className={"table-cell"} data-header="Ping (ms)">
                        <span
                            onClick={() =>
                                this.props.handleSort(
                                    "ping",
                                    this.props.sortOrder.ping,
                                )
                            }
                            className={"table-cell-header-text"}
                        >
                            Ping (ms)
                            <span className=" icon has-text-info">
                                <i
                                    className={
                                        "fa fa-arrow-circle-" +
                                        (this.props.sortOrder.ping
                                            ? "down"
                                            : "up")
                                    }
                                />
                            </span>
                        </span>
                    </div>
                </div>
                {this.props.entries.map((entry, index) => {
                    return (
                        <Entry
                            entry={entry}
                            key={entry.id}
                            city={this.props.city}
                            showNote={this.props.showNote}
                            sanitizeInputs={this.props.sanitizeInputs}
                            validateInputs={this.props.validateInputs}
                            coordinates={this.props.coordinates}
                        />
                    )
                })}
            </div>
        )
    }
}

EntriesTable.contextTypes = {
    authUser: PropTypes.object,
}

export default EntriesTable
