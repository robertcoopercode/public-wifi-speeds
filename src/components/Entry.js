import React, {Component} from 'react';
import * as firebase from 'firebase';
import PropTypes from "prop-types";

class Entry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOverlay: true
        }
    }

    componentDidMount() {
        this.setState({
            date: this.props.entry.date,
            location: this.props.entry.location,
            download: this.props.entry.download,
            upload: this.props.entry.upload,
            ping: this.props.entry.ping,
            note: this.props.entry.note,
        })
    }

    deleteItem = (id) => {
        firebase.database().ref('/entries/' + this.props.city + '/' + id).remove()
    }

    updateItem = (id) => {
        firebase.database().ref('/entries/' + this.props.city + '/' + id).update({
            location: this.state.location,
            date: this.getCurrentDate(),
            download: parseFloat(this.state.download),
            upload: parseFloat(this.state.upload),
            ping: parseFloat(this.state.ping),
            note: this.state.note
        })
        this.setState({showOverlay: true})
    }

    getCurrentDate = () => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        let date = dd + '/' + mm + '/' + yyyy;
        return date;
    }

    render() {
        return (
            <div className={"table-row"}>
                {this.state.showOverlay
                    ?
                    <React.Fragment>
                        <span className={"table-cell"} data-header="Date">
                        {this.props.entry.date}
                    </span>
                        <span className={"table-cell"} data-header="Location">
                {this.props.entry.location}
                    </span>
                        <span className={"table-cell"} data-header="Download (Mbps)">{this.props.entry.download}</span>
                        <span className={"table-cell"} data-header="Upload (Mbps)">{this.props.entry.upload}</span>
                        <span className={"table-cell"} data-header="Ping (ms)">{this.props.entry.ping}</span>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <span className={"table-cell"} data-header="Date">
                        {this.props.entry.date}
                    </span>
                        <input className={"table-cell table-cell--input"}
                               data-header="Location"
                               type={"text"}
                               value={this.state.location}
                               onChange={(e) => this.setState({location: e.target.value})}/>
                        <input className={"table-cell table-cell--input"}
                               data-header="Download"
                               type={"number"}
                               min="0"
                               max="1000"
                               step="0.01"
                               value={this.state.download}
                               onChange={(e) => this.setState({download: e.target.value})}/>
                        <input className={"table-cell table-cell--input"}
                               data-header="Upload"
                               type={"number"}
                               min="0"
                               max="1000"
                               step="0.01"
                               value={this.state.upload}
                               onChange={(e) => this.setState({upload: e.target.value})}/>
                        <input className={"table-cell table-cell--input"}
                               data-header="Ping"
                               type={"number"}
                               min="0"
                               max="500"
                               step="0.01"
                               value={this.state.ping}
                               onChange={(e) => this.setState({ping: e.target.value})}/>
                        <div className={"table-save-container"}>
                            <button
                                className={"table-save button is-small is-success"}
                                onClick={() => this.updateItem(this.props.entry.id)}
                            >Save
                            </button>
                        </div>
                    </React.Fragment>
                }

                {this.context.authUser.uid === this.props.entry.uid && this.state.showOverlay
                    ? <div className="table-row-overlay">
                        <button
                            className={"table-row-button button is-small is-info"}
                            onClick={() => this.props.showNote(this.props.entry.note)}
                        >Note</button>
                        <button
                            className="table-row-button button is-small is-primary"
                            onClick={() => this.setState({showOverlay: false})}
                        >Edit
                        </button>
                        <button className="table-row-button button is-small is-danger"
                                onClick={() => this.deleteItem(this.props.entry.id)}>Delete
                        </button>
                    </div>
                    : <div className="table-row-overlay">
                        <button
                            className={"table-row-button button is-small is-info"}
                            onClick={() => this.props.showNote(this.props.entry.note)}
                        >Note</button>
                    </div>
                }
            </div>
        )
    }
}

Entry.contextTypes = {
    authUser: PropTypes.object,
};

export default Entry;