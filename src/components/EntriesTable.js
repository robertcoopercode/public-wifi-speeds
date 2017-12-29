import React, {Component} from 'react';
import Entry from './Entry';
import * as firebase from 'firebase';
import PropTypes from "prop-types";

class EntriesTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ascTimestampOrder: false,
            ascLocationOrder: false,
            ascDownloadOrder: false,
            ascUploadOrder: false,
            ascPingOrder: false,
        }
    }

    handleSort = (field, direction) => {
        const stateProperty = 'asc' + field[0].toUpperCase() + field.slice(1) + 'Order'
        this.setState({[stateProperty]: !direction})
        this.props.fetchEnries(undefined, field, direction);
    }

    deleteItem = (id) => {
        firebase.database().ref('/entries/' + this.props.city + '/' + id).remove()
    }

    render() {
        return <div className={"table entries__table"}>
            <div className={"table-row table-header"}>
                <div className={"table-cell"} data-header="Date">
                    <span
                        onClick={() => this.handleSort("timestamp", this.state.ascTimestampOrder)}
                        className={"table-cell-header-text"}>
                            Date
                        <span className="icon has-text-info">
                          <i className={"fa fa-arrow-circle-" + (this.state.ascTimestampOrder ? "down" : "up")}/>
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Location">
                    <span
                        onClick={() => this.handleSort("location", this.state.ascLocationOrder)}
                        className={"table-cell-header-text"}>
                            Location
                        <span className="icon has-text-info">
                          <i className={"fa fa-arrow-circle-" + (this.state.ascLocationOrder ? "down" : "up")}/>
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Download (Mbps)">
                    <span
                        onClick={() => this.handleSort("download", this.state.ascDownloadOrder)}
                        className={"table-cell-header-text"}>
                            Download (Mbps)
                        <span className="icon has-text-info">
                          <i className={"fa fa-arrow-circle-" + (this.state.ascDownloadOrder ? "down" : "up")}/>
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Upload (Mbps)">
                    <span
                        onClick={() => this.handleSort("upload", this.state.ascUploadOrder)}
                        className={"table-cell-header-text"}>
                            Upload (Mbps)
                        <span className="icon has-text-info">
                          <i className={"fa fa-arrow-circle-" + (this.state.ascUploadOrder ? "down" : "up")}/>
                        </span>
                    </span>
                </div>
                <div className={"table-cell"} data-header="Ping (ms)">
                    <span
                        onClick={() => this.handleSort("ping", this.state.ascPingOrder)}
                        className={"table-cell-header-text"}>
                            Ping (ms)
                        <span className=" icon has-text-info">
                          <i className={"fa fa-arrow-circle-" + (this.state.ascPingOrder ? "down" : "up")}/>
                        </span>
                    </span>
                </div>
            </div>
            {this.props.entries.map((entry, index) => {
                return <Entry
                    entry={entry}
                    key={entry.id}
                    city={this.props.city}
                    showNote={this.props.showNote}
                    sanitizeInputs={this.props.sanitizeInputs}
                    validateInputs={this.props.validateInputs}
                />
            })}
        </div>
    }
}

EntriesTable.contextTypes = {
    authUser: PropTypes.object,
};

export default EntriesTable;