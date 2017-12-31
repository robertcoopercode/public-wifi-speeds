import React, {Component} from 'react';
import CitySelection from './CitySelection';
import MobileSort from './MobileSort';
import EntriesTable from './EntriesTable';
import AddEntryForm from './AddEntryForm';
import Stats from './Stats';
import '../App.css';
import withAuthorization from './withAuthorization';

import * as firebase from 'firebase';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
            showForm: false,
            showNote: false,
            showStats: false,
            showDropdown: false,
            city: 'kingston',
            cityCoordinates: {
                latitude: 44.2312,
                longitude: -76.4860,
            },
            sortField: 'location',
            sortAscending: true,
            sortOrder: {
                timestamp: false,
                location: false,
                download: false,
                upload: false,
                ping: false,
            }
        }
    }

    componentDidMount() {
        document.title = "Wifi Speeds - " + this.state.city[0].toUpperCase() + this.state.city.slice(1)
        this.fetchEnries(this.state.city, "location")
    }

    componentDidUpdate() {
        if (this.state.showForm) {
            document.getElementsByTagName('body')[0].style.position = 'fixed'
        } else {
            document.getElementsByTagName('body')[0].style.position = 'relative'
        }
    }

    showNote = (note) => {
        this.setState((prevState) => {
            return (
                {
                    showNote: !prevState.showNote,
                    note: note
                }
            )
        })
    }

    sanitizeInputs = (location, date, timestamp, download, upload, ping, note, uid) => {
        return {
            location: location,
            date: date,
            timestamp: timestamp,
            download: parseFloat(parseFloat(download).toFixed(2)),
            upload: parseFloat(parseFloat(upload).toFixed(2)),
            ping: parseFloat(parseFloat(ping).toFixed(2)),
            note: note.trim(),
            uid: uid
        }
    }

    validateInputs = (location, locationSelected, download, upload, ping, note = "") => {
        let errors = {};
        if (location.length > 100) {
            errors.location = "Invalid input"
        }
        if (!locationSelected) {
            errors.location = "Please select a place from the list of suggested locations"
        }
        if (isNaN(parseFloat(download)) ||
            (download.toString().split(".")[1]
                && download.toString().split(".")[1].length > 2) ||
            (parseFloat(download) > 1000)
        ) {
            errors.download = "Invalid input"
        }
        if (isNaN(parseFloat(upload)) ||
            (upload.toString().split(".")[1]
                && upload.toString().split(".")[1].length > 2) ||
            (parseFloat(upload) > 1000)
        ) {
            errors.upload = "Invalid input"
        }
        if (isNaN(parseFloat(ping)) ||
            (ping.toString().split(".")[1]
                && ping.toString().split(".")[1].length > 2) ||
            (parseFloat(ping) > 1000)
        ) {
            errors.ping = "Invalid input"
        }
        if (note.length > 100 || (note.length > 0 && note.trim().length === 0)) {
            errors.note = "Invalid input"
        }
        return errors;
    }

    fetchEnries = (city = this.state.city, sortField = this.state.sortField, sortAscending = this.state.sortAscending) => {
        /* Create reference to entries in Firebase Database */
        const databaseReference = firebase.database().ref('/entries/' + city).orderByChild(sortField);
        databaseReference.on('value', snapshot => {
            /* Update React state when message is added at Firebase Database */
            let entries = [];
            if (!!snapshot.val()) {
                snapshot.forEach(function(child) {
                    let entry = {
                        location: child.val().location,
                        date: child.val().date,
                        download: child.val().download,
                        upload: child.val().upload,
                        ping: child.val().ping,
                        id: child.key,
                        note: child.val().note,
                        uid: child.val().uid
                    };
                    entries.push(entry);
                })
            }
            if (!sortAscending) {
                entries.reverse();
            }
            this.setState({
                entries: entries,
                sortField: sortField,
                sortAscending: sortAscending
            });
        })
    }

    selectCity = (name, coordinates) => {
        document.title = "Wifi Speeds - " + name[0].toUpperCase() + name.slice(1)
        this.fetchEnries(name, undefined, undefined)
        this.setState({
            city: name,
            cityCoordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            }
        })
    }

    signout = () => {
        firebase.auth().signOut().then(function () {
        }).catch(function (error) {
            console.log("Error: " + error);
        });
    }

    handleSort = (field, direction) => {
        let sortOrder = this.state.sortOrder;
        sortOrder[field] = !direction;
        this.setState({sortOrder})
        this.fetchEnries(undefined, field, direction);
    }

    render() {
        return (
            <div className={"home"}>
                <div className={"home__top-section"}>
                    <CitySelection city={this.state.city} selectCity={this.selectCity} />
                    <button className="home__logout-button button is-danger" onClick={this.signout}>Signout</button>
                </div>
                <div className={"home__summary-section summary-section"}>
                    <h2 className={"summary-section__title"}>Wifi Speeds for {this.state.city}</h2>
                    <div className={"summary-section__actions"}>
                        <button className={"summary-section__action-button button is-primary"}
                                onClick={() => this.setState({showForm: true})}>Add New Entry
                        </button>
                        <button className={"summary-section__action-button button is-info"}
                                onClick={() => this.setState({showStats: true})}>Overall Stats
                        </button>
                        <MobileSort sortField={this.state.sortField} sortOrder={this.state.sortOrder} handleSort={this.handleSort} />
                    </div>
                </div>

                <EntriesTable
                    entries={this.state.entries}
                    city={this.state.city}
                    fetchEnries={this.fetchEnries}
                    showNote={this.showNote}
                    sanitizeInputs={this.sanitizeInputs}
                    validateInputs={this.validateInputs}
                    sortOrder={this.state.sortOrder}
                    handleSort={this.handleSort}
                    coordinates={this.state.cityCoordinates}
                />

                {/* Add Entry Form Modal */}
                <div className={"modal modal--form" + (this.state.showForm ? " is-active" : "")}>
                    <div className="modal-background" onClick={() => this.setState({showForm: false})}/>
                    <div className="modal-content">
                        <article className="message is-dark">
                            <div className="message-header">
                                <p>Add New Entry</p>
                            </div>
                            <div className="message-body">
                                <AddEntryForm
                                    hideForm={() => this.setState({showForm: false})}
                                    city={this.state.city}
                                    cityCoordinates={this.state.cityCoordinates}
                                    sanitizeInputs={this.sanitizeInputs}
                                    validateInputs={this.validateInputs}
                                />
                            </div>
                        </article>
                    </div>
                    <button className="modal-close is-large" aria-label="close"
    onClick={() => this.setState({showForm: false})}/>
                </div>

                {/* Statistics Modal */}
                <div className={"modal modal--stats" + (this.state.showStats ? " is-active" : "")}>
                    <div className="modal-background" onClick={() => this.setState({showStats: false})}/>
                    <div className="modal-content">
                        <Stats entries={this.state.entries}/>
                    </div>
                    <button className="modal-close is-large" aria-label="close"
    onClick={() => this.setState({showStats: false})}/>
                </div>

                {/* Note Modal */}
                <div className={"modal modal--note" + (this.state.showNote ? " is-active" : "")}>
                    <div className="modal-background" onClick={() => this.setState({showNote: false})}/>
                    <div className="modal-content">
                        <article className="message">
                            <div className="message-body">
                                {this.state.note}
                            </div>
                        </article>
                    </div>
                    <button className="modal-close is-large" aria-label="close"
                            onClick={() => this.setState({showNote: false})}/>
                </div>
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Home);
