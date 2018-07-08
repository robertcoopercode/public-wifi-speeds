import * as firebase from "firebase"
import PropTypes from "prop-types"
import React, { Component } from "react"
import styled from "styled-components"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

import { roundDecimals, capitalize } from "../utils"
import { loadEntries, sortEntries } from "../actions"

import EntriesTable from "../components/EntriesTable"
import PageHeader from "../components/PageHeader"
import EntriesHeader from "../components/EntriesHeader"
import AddEntryFormModal from "../components/AddEntryFormModal"
import EntryNoteModal from "../components/EntryNoteModal"
import HomeContent from "../components/HomeContent"

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            entries: [],
            showForm: false,
            showNote: false,
            showDropdown: false,
        }
    }

    componentDidMount() {
        document.title =
            "Wifi Speeds - " + capitalize(this.props.city.selectedCity)

        const databaseReference = firebase
            .database()
            .ref("/entries/" + this.props.city.selectedCity)
            .orderByChild("location")

        databaseReference.on("value", snapshot => {
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
            this.props.loadEntries(entries)
        })
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

            const databaseReference = firebase
                .database()
                .ref("/entries/" + nextProps.city.selectedCity)
                .orderByChild(this.props.sort.lastSorted)

            databaseReference.on("value", snapshot => {
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
                this.props.loadEntries(entries)
            })
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

    fetchEnries = (sortField = "location", sortDirection = "ascending") => {
        // Create reference to entries in Firebase Database for the current city being viewed
        const databaseReference = firebase
            .database()
            .ref("/entries/" + this.props.city.selectedCity)
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
            this.props.loadEntries(entries)
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
        this.fetchEnries(field, direction)
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
        this.fetchEnries(field, direction)
    }

    handleShowEntryForm = () => {
        this.props.user
            ? this.setState({ showForm: true })
            : this.props.history.push("/login")
    }

    render() {
        const Home = styled.div`
            color: #ffffff;
            width: 1200px;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 20px 40px;
        `

        return (
            <Home>
                <PageHeader signout={this.signout} authUser={this.props.user} />
                <HomeContent />
                <EntriesHeader
                    selectedCity={this.props.city.selectedCity}
                    showEntryForm={this.handleShowEntryForm}
                    sort={this.props.sort}
                    handleMobileSort={this.handleMobileSort}
                />
                <EntriesTable
                    entries={this.props.entries}
                    city={this.props.city.selectedCity}
                    showNote={this.showNote}
                    sanitizeInputs={this.sanitizeInputs}
                    validateInputs={this.validateInputs}
                    sort={this.props.sort}
                    handleSort={this.handleSort}
                    cityCoordinates={this.props.city.coordinates}
                />
                <AddEntryFormModal
                    showForm={this.state.showForm}
                    hideModal={() => this.setState({ showForm: false })}
                    selectedCity={this.props.city.selectedCity}
                    coordinates={this.props.city.coordinates}
                    sanitizeInputs={this.sanitizeInputs}
                    validateInputs={this.validateInputs}
                />
                <EntryNoteModal
                    showNote={this.state.showNote}
                    hideModal={() => this.setState({ showNote: false })}
                    note={this.state.note}
                />
            </Home>
        )
    }
}

HomePage.propTypes = {
    city: PropTypes.object,
    entries: PropTypes.array,
    handleSort: PropTypes.func,
    loadEntries: PropTypes.func,
    location: PropTypes.object,
    sort: PropTypes.object,
    user: PropTypes.object,
}

const mapStateToProps = function(state) {
    return {
        city: state.city,
        sort: state.sort,
        entries: state.entries,
        user: state.user,
    }
}

const mapDispatchToProps = function(dispatch) {
    return bindActionCreators(
        {
            handleSort: sortEntries,
            loadEntries: loadEntries,
        },
        dispatch,
    )
}

const ConnectedHomePage = connect(mapStateToProps, mapDispatchToProps)(HomePage)

export default withRouter(ConnectedHomePage)
