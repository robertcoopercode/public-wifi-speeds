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
        console.log("handling")
        const stateProperty = 'asc' + field[0].toUpperCase() + field.slice(1) + 'Order'
        console.log(stateProperty)
        this.setState({[stateProperty]: !direction})
        this.props.sort(field, direction);
    }

    deleteItem = (id) => {
        firebase.database().ref('/entries/' + this.props.city + '/' + id).remove()
    }

    render() {
        return <div className={"table entries__table"}>
            <div className={"table-row table-header"}>
                <span className={"table-cell"} data-header="Date">Date
                    <span onClick={() => this.handleSort("timestamp", this.state.ascTimestampOrder)} className="table-header-sort icon has-text-info">
                      <i className={"fa fa-arrow-circle-" + (this.state.ascTimestampOrder ? "down" : "up")}/>
                    </span>
                </span>
                <span className={"table-cell"} data-header="Location">Location
                    <span onClick={() => this.handleSort("location", this.state.ascLocationOrder)} className="table-header-sort icon has-text-info">
                      <i className={"fa fa-arrow-circle-" + (this.state.ascLocationOrder ? "down" : "up")}/>
                    </span>
                </span>
                <span className={"table-cell"} data-header="Download (Mbps)">Download (Mbps)
                    <span onClick={() => this.handleSort("download", this.state.ascDownloadOrder)} className="table-header-sort icon has-text-info">
                      <i className={"fa fa-arrow-circle-" + (this.state.ascDownloadOrder ? "down" : "up")}/>
                    </span>
                </span>
                <span className={"table-cell"} data-header="Upload (Mbps)">Upload (Mbps)
                    <span onClick={() => this.handleSort("upload", this.state.ascUploadOrder)} className="table-header-sort icon has-text-info">
                      <i className={"fa fa-arrow-circle-" + (this.state.ascUploadOrder ? "down" : "up")}/>
                    </span>
                </span>
                <span className={"table-cell"} data-header="Ping (ms)">Ping (ms)
                    <span onClick={() => this.handleSort("ping", this.state.ascPingOrder)} className="table-header-sort icon has-text-info">
                      <i className={"fa fa-arrow-circle-" + (this.state.ascPingOrder ? "down" : "up")}/>
                    </span>
                </span>
            </div>
            {this.props.entries.map((entry, index) => {
                return <Entry entry={entry} key={entry.id} city={this.props.city} showNote={this.props.showNote}/>
            })}
        </div>
    }
}

EntriesTable.contextTypes = {
    authUser: PropTypes.object,
};

export default EntriesTable;