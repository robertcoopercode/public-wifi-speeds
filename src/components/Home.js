import React, { Component } from "react"
import { connect } from "react-redux"

import "../App.css"
import { roundDecimals, capitalize } from "../utils"

import CitySelection from "./CitySelection"
import MobileSort from "./MobileSort"
import EntriesTable from "./EntriesTable"
import AddEntryForm from "./AddEntryForm"
import Stats from "./Stats"
import withAuthorization from "./withAuthorization"

import * as firebase from "firebase"
import { sortEntries } from "../actions"
import { bindActionCreators } from "redux"

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            entries: [],
            showForm: false,
            showNote: false,
            showStats: false,
            showDropdown: false,
            sortField: "location",
            sortAscending: "ascending",
            sortOrder: {
                timestamp: false,
                location: false,
                download: false,
                upload: false,
                ping: false,
            },
        }
    }

    componentDidMount() {
        document.title =
            "Wifi Speeds - " + capitalize(this.props.city.selectedCity)
        this.fetchEnries(this.props.city.selectedCity, "location", "ascending")
    }

    componentDidUpdate() {
        // Fix for mobile modal forms where the cursor would be in the incorrect position on input focus
        if (this.state.showForm) {
            document.getElementsByTagName("body")[0].style.position = "fixed"
        } else {
            document.getElementsByTagName("body")[0].style.position = "relative"
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.city.selectedCity !== nextProps.city.selectedCity) {
            document.title =
                "Wifi Speeds - " + capitalize(nextProps.city.selectedCity)
            this.fetchEnries(nextProps.city.selectedCity, undefined, undefined)
        }
    }

    showNote = note => {
        this.setState(prevState => {
            return {
                showNote: !prevState.showNote,
                note: note,
            }
        })
    }

    // Function that sanitizes values before they are stored to the database
    sanitizeInputs = (
        location,
        date,
        timestamp,
        download,
        upload,
        ping,
        note,
        uid,
    ) => {
        return {
            location: location,
            date: date,
            timestamp: timestamp,
            download: roundDecimals(download, 2),
            upload: roundDecimals(upload, 2),
            ping: roundDecimals(ping, 2),
            note: note.trim(),
            uid: uid,
        }
    }

    validateInputs = (
        location,
        locationSelected,
        download,
        upload,
        ping,
        note = "",
    ) => {
        let errors = {}
        if (location.length > 100) {
            errors.location = "Invalid input"
        }
        if (!locationSelected) {
            errors.location =
                "Please select a place from the list of suggested locations"
        }
        if (
            isNaN(parseFloat(download)) ||
            (download.toString().split(".")[1] &&
                download.toString().split(".")[1].length > 2) ||
            parseFloat(download) > 1000
        ) {
            errors.download = "Invalid input"
        }
        if (
            isNaN(parseFloat(upload)) ||
            (upload.toString().split(".")[1] &&
                upload.toString().split(".")[1].length > 2) ||
            parseFloat(upload) > 1000
        ) {
            errors.upload = "Invalid input"
        }
        if (
            isNaN(parseFloat(ping)) ||
            (ping.toString().split(".")[1] &&
                ping.toString().split(".")[1].length > 2) ||
            parseFloat(ping) > 1000
        ) {
            errors.ping = "Invalid input"
        }
        if (note.length > 1000) {
            errors.note = "Notes have to be under 1000 characters."
        }
        return errors
    }

    fetchEnries = (
        city = this.props.city.selectedCity,
        sortField = "location",
        sortDirection = "ascending",
    ) => {
        // Create reference to entries in Firebase Database for the current city being viewed
        const databaseReference = firebase
            .database()
            .ref("/entries/" + city)
            .orderByChild(sortField)
        databaseReference.on("value", snapshot => {
            // Update React state when message is added at Firebase Database
            let entries = []
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
                        uid: child.val().uid,
                    }
                    entries.push(entry)
                })
            }
            if (sortDirection === "descending") {
                entries.reverse()
            }
            this.setState({
                entries: entries,
            })
        })
    }

    selectCity = (name, coordinates) => {
        this.setState({
            city: name,
            cityCoordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            },
        })
    }

    signout = () => {
        firebase
            .auth()
            .signOut()
            .then(function() {})
            .catch(function(error) {
                console.log("Error: " + error)
            })
    }

    handleMobileSort = (field, direction) => {
        this.props.handleSort(field, direction)
        this.fetchEnries(undefined, field, direction)
    }

    handleSort = field => {
        let direction = "ascending"
        if (
            this.props.sort.currentOrder[field] === "ascending" ||
            this.props.sort.currentOrder[field] === undefined
        ) {
            direction = "descending"
        }
        this.props.handleSort(field, direction)
        this.fetchEnries(undefined, field, direction)
    }

    render() {
        return (
            <div className={"home"}>
                <div className={"home__top-section"}>
                    <CitySelection />
                    <button
                        className="home__logout-button button is-danger"
                        onClick={this.signout}
                    >
                        Signout
                    </button>
                </div>
                <div className={"home__summary-section summary-section"}>
                    <h2 className={"summary-section__title"}>
                        Wifi Speeds for {this.props.city.selectedCity}
                    </h2>
                    <div className={"summary-section__actions"}>
                        <button
                            className={
                                "summary-section__action-button button is-primary"
                            }
                            onClick={() => this.setState({ showForm: true })}
                        >
                            Add New Entry
                        </button>
                        <button
                            className={
                                "summary-section__action-button button is-info"
                            }
                            onClick={() => this.setState({ showStats: true })}
                        >
                            Overall Stats
                        </button>
                        <MobileSort
                            sort={this.props.sort}
                            handleSort={this.handleMobileSort}
                        />
                    </div>
                </div>

                <EntriesTable
                    entries={this.state.entries}
                    city={this.props.city.selectedCity}
                    fetchEnries={this.fetchEnries}
                    showNote={this.showNote}
                    sanitizeInputs={this.sanitizeInputs}
                    validateInputs={this.validateInputs}
                    sort={this.props.sort}
                    handleSort={this.handleSort}
                    cityCoordinates={this.props.city.coordinates}
                />

                {/* Add Entry Form Modal */}
                <div
                    className={
                        "modal modal--form" +
                        (this.state.showForm ? " is-active" : "")
                    }
                >
                    <div
                        className="modal-background"
                        onClick={() => this.setState({ showForm: false })}
                    />
                    <div className="modal-content">
                        <article className="message is-dark">
                            <div className="message-header">
                                <p>Add New Entry</p>
                            </div>
                            <div className="message-body">
                                <AddEntryForm
                                    hideForm={() =>
                                        this.setState({ showForm: false })
                                    }
                                    city={this.props.city.selectedCity}
                                    cityCoordinates={
                                        this.props.city.coordinates
                                    }
                                    sanitizeInputs={this.sanitizeInputs}
                                    validateInputs={this.validateInputs}
                                />
                            </div>
                        </article>
                    </div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={() => this.setState({ showForm: false })}
                    />
                </div>

                {/* Statistics Modal */}
                <div
                    className={
                        "modal modal--stats" +
                        (this.state.showStats ? " is-active" : "")
                    }
                >
                    <div
                        className="modal-background"
                        onClick={() => this.setState({ showStats: false })}
                    />
                    <div className="modal-content">
                        <Stats entries={this.state.entries} />
                    </div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={() => this.setState({ showStats: false })}
                    />
                </div>

                {/* Note Modal */}
                <div
                    className={
                        "modal modal--note" +
                        (this.state.showNote ? " is-active" : "")
                    }
                >
                    <div
                        className="modal-background"
                        onClick={() => this.setState({ showNote: false })}
                    />
                    <div className="modal-content">
                        <article className="message">
                            <div className="message-body">
                                {this.state.note}
                            </div>
                        </article>
                    </div>
                    <button
                        className="modal-close is-large"
                        aria-label="close"
                        onClick={() => this.setState({ showNote: false })}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        city: state.city,
        sort: state.sort,
    }
}

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators(
        {
            handleSort: sortEntries,
        },
        dispatch,
    )
}

const authCondition = authUser => !!authUser

const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home)

export default withAuthorization(authCondition)(ConnectedHome)
