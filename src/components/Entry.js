import React, { Component, Fragment} from "react"
import moment from "moment"
import * as firebase from "firebase"
import PropTypes from "prop-types"
import PlacesAutocomplete from "react-places-autocomplete"

// This line is required to tell the linter that the google variable will be available globally at runtime
/*global google*/

class Entry extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showOverlay: false,
            errors: null,
            locationSelected: true,
            editEntry: false,
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

    deleteItem = id => {
        firebase
            .database()
            .ref("/entries/" + this.props.city + "/" + id)
            .remove()
    }

    // First level of validation of form inputs
    checkValidation = () => {
        // Prevent default form validation bubbles from appearing
        this.editForm.addEventListener(
            "invalid",
            function(event) {
                event.preventDefault()
            },
            true,
        )
        const invalidFields = this.editForm.querySelectorAll(":invalid")
        let errorMessages = {}

        // Loop through all invalid fields and add them to the errorMessages object
        invalidFields.forEach((field, key) => {
            errorMessages[field.dataset.name] =
                invalidFields[key].validationMessage
        })

        // If there are errors, give focus to the first invalid field
        if (invalidFields.length > 0) {
            invalidFields[0].focus()
            this.setState({
                errors: errorMessages,
            })
        }
    }

    updateItem = (e, id) => {
        e.preventDefault()
        // Second level of validation before submitting data to the database
        const errors = this.props.validateInputs(
            this.state.location,
            this.state.locationSelected,
            this.state.download,
            this.state.upload,
            this.state.ping,
        )
        if (Object.keys(errors).length === 0) {
            firebase
                .database()
                .ref("/entries/" + this.props.city + "/" + id)
                .update(
                    // Returns object
                    this.props.sanitizeInputs(
                        this.state.location,
                        this.getCurrentDate(),
                        Date.now(),
                        this.state.download,
                        this.state.upload,
                        this.state.ping,
                        this.state.note,
                        this.context.authUser.uid,
                    ),
                )
            this.setState({ editEntry: false, errors: null })
        } else {
            this.setState({ errors: errors })
        }
    }

    getCurrentDate = () => {
        return moment(new Date()).format('DD/MM/YYYY')
    }

    handleLocationSelect = address => {
        this.setState({
            location: address,
            locationSelected: true,
        })
    }

    render() {
        return (
            <div className={"table-row"}>
                {!this.state.editEntry ? (
                    <Fragment>
                        <div className={"table-cell"} data-header="Date">
                            <span className={"table-cell-text"}>
                                {this.props.entry.date}
                            </span>
                        </div>
                        <div className={"table-cell"} data-header="Location">
                            <span className={"table-cell-text"}>
                                {this.props.entry.location}
                            </span>
                        </div>
                        <div
                            className={"table-cell"}
                            data-header="Download (Mbps)"
                        >
                            <span className={"table-cell-text"}>
                                {this.props.entry.download}
                            </span>
                        </div>
                        <div
                            className={"table-cell"}
                            data-header="Upload (Mbps)"
                        >
                            <span className={"table-cell-text"}>
                                {this.props.entry.upload}
                            </span>
                        </div>
                        <div className={"table-cell"} data-header="Ping (ms)">
                            <span className={"table-cell-text"}>
                                {this.props.entry.ping}
                            </span>
                        </div>

                        <div
                            className={"table-row-indicators"}
                            onMouseOver={() =>
                                this.setState({ showOverlay: true })
                            }
                            onMouseLeave={() =>
                                this.state.showOverlay
                                    ? this.setState({ showOverlay: false })
                                    : null
                            }
                        >
                            {this.state.showOverlay &&
                            (this.props.entry.note.length > 0 ||
                                this.context.authUser.uid ===
                                    this.props.entry.uid) ? (
                                <div
                                    className="table-row-overlay"
                                    onMouseLeave={() =>
                                        this.setState({ showOverlay: false })
                                    }
                                >
                                    {this.props.entry.note.length > 0 ? (
                                        <button
                                            className={
                                                "table-row-button button is-small is-info"
                                            }
                                            onClick={() =>
                                                this.props.showNote(
                                                    this.props.entry.note,
                                                )
                                            }
                                        >
                                            Note
                                        </button>
                                    ) : null}
                                    {this.context.authUser.uid ===
                                    this.props.entry.uid ? (
                                        <Fragment>
                                            <button
                                                className="table-row-button button is-small is-primary"
                                                onClick={() =>
                                                    this.setState({
                                                        editEntry: true,
                                                        showOverlay: false,
                                                    })
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="table-row-button button is-small is-danger"
                                                onClick={() =>
                                                    this.deleteItem(
                                                        this.props.entry.id,
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </Fragment>
                                    ) : null}
                                </div>
                            ) : null}

                            {this.props.entry.note.length > 0 ? (
                                <div
                                    className={
                                        "table-row-indicator table-row-indicator--note"
                                    }
                                />
                            ) : null}
                            {this.context.authUser.uid ===
                            this.props.entry.uid ? (
                                <div
                                    className={
                                        "table-row-indicator table-row-indicator--user-entry"
                                    }
                                />
                            ) : null}
                        </div>
                    </Fragment>
                ) : (
                    <form
                        className={"table-row--form"}
                        ref={element => (this.editForm = element)}
                        onSubmit={e => this.updateItem(e, this.props.entry.id)}
                    >
                        <div
                            className={"table-cell table-cell--edit-date"}
                            data-header="Date"
                        >
                            <span className={"table-cell--date"}>
                                {this.props.entry.date}
                            </span>
                        </div>
                        <div
                            className={
                                "table-cell" +
                                (this.state.errors && this.state.errors.location
                                    ? " table-cell--danger"
                                    : " table-cell--edit")
                            }
                            data-header="Location"
                        >
                            {this.state.errors && this.state.errors.location ? (
                                <p className="table-cell--error">Invalid</p>
                            ) : null}
                            <PlacesAutocomplete
                                inputProps={{
                                    value: this.state.location,
                                    onChange: location =>
                                        this.setState({
                                            location,
                                            locationSelected: true,
                                        }),
                                    maxLength: "150",
                                    required: true,
                                    "data-name": "location",
                                }}
                                classNames={{
                                    root: "table-cell__autocomplete",
                                    autocompleteContainer:
                                        "table-cell__autocomplete-results",
                                    input: "table-cell--input",
                                }}
                                googleLogo={false}
                                options={{
                                    location: new google.maps.LatLng(
                                        this.props.cityCoordinates.latitude,
                                        this.props.cityCoordinates.longitude,
                                    ),
                                    radius: 20000,
                                    type: ["address"],
                                }}
                                onSelect={this.handleLocationSelect}
                            />
                        </div>
                        <div
                            className={
                                "table-cell" +
                                (this.state.errors && this.state.errors.download
                                    ? " table-cell--danger"
                                    : " table-cell--edit")
                            }
                            data-header="Download"
                        >
                            {this.state.errors && this.state.errors.download ? (
                                <p className="table-cell--error">Invalid</p>
                            ) : null}
                            <input
                                className={"table-cell--input"}
                                data-name="download"
                                type={"number"}
                                min="0"
                                max="1000"
                                step="0.01"
                                value={this.state.download}
                                onChange={e =>
                                    this.setState({ download: e.target.value })
                                }
                            />
                        </div>
                        <div
                            className={
                                "table-cell" +
                                (this.state.errors && this.state.errors.upload
                                    ? " table-cell--danger"
                                    : " table-cell--edit")
                            }
                            data-header="Upload"
                        >
                            {this.state.errors && this.state.errors.upload ? (
                                <p className="table-cell--error">Invalid</p>
                            ) : null}
                            <input
                                className={"table-cell--input"}
                                data-name="upload"
                                type="number"
                                min="0"
                                max="1000"
                                step="0.01"
                                value={this.state.upload}
                                onChange={e =>
                                    this.setState({ upload: e.target.value })
                                }
                            />
                        </div>
                        <div
                            className={
                                "table-cell" +
                                (this.state.errors && this.state.errors.ping
                                    ? " table-cell--danger"
                                    : " table-cell--edit")
                            }
                            data-header="Ping"
                        >
                            {this.state.errors && this.state.errors.ping ? (
                                <p className="table-cell--error">Invalid</p>
                            ) : null}
                            <input
                                className={"table-cell--input"}
                                data-name="ping"
                                type={"number"}
                                min="0"
                                max="1000"
                                step="0.01"
                                value={this.state.ping}
                                onChange={e =>
                                    this.setState({ ping: e.target.value })
                                }
                            />
                        </div>
                        <div className={"table-save-container"}>
                            <button
                                className={
                                    "table-save button is-small is-success"
                                }
                                onClick={this.checkValidation}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )
    }
}

Entry.contextTypes = {
    authUser: PropTypes.object,
}

export default Entry
