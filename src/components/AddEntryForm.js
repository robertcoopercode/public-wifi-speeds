import React, { Component } from "react"
import PropTypes from "prop-types"
import * as firebase from "firebase"
import PlacesAutocomplete from "react-places-autocomplete"

// This line is required to tell the linter that the google variable will be available globally at runtime
/*global google*/

class AddEntryForm extends Component {
    constructor(props) {
        super(props)
        this.INITIAL_STATE = {
            location: "",
            download: "",
            upload: "",
            ping: "",
            note: "",
            errors: null,
            locationSelected: false,
        }
        this.state = this.INITIAL_STATE
    }
    componentDidMount = () => {
        // Prevent default form validation bubbles from appearing
        this.entryForm.addEventListener(
            "invalid",
            function(event) {
                event.preventDefault()
            },
            true,
        )
    }
    getCurrentDate = () => {
        let today = new Date()
        let dd = today.getDate()
        let mm = today.getMonth() + 1 //January is 0!

        let yyyy = today.getFullYear()
        if (dd < 10) {
            dd = "0" + dd
        }
        if (mm < 10) {
            mm = "0" + mm
        }
        let date = dd + "/" + mm + "/" + yyyy
        return date
    }
    checkValidation = () => {
        const invalidFields = this.entryForm.querySelectorAll(":invalid")
        let errorMessages = {}

        // Loop through all invalid fields and add them to the errorMessages object
        for (let i = 0; i < invalidFields.length; i++) {
            const fieldName = invalidFields[i].dataset.name
            errorMessages[fieldName] = invalidFields[i].validationMessage
        }
        // If there are errors, give focus to the first invalid field and set the errors into state
        if (invalidFields.length > 0) {
            invalidFields[0].focus()
            this.setState({
                errors: errorMessages,
            })
        }
    }
    onSubmit = e => {
        e.preventDefault()
        const errors = this.props.validateInputs(
            this.state.location,
            this.state.locationSelected,
            this.state.download,
            this.state.upload,
            this.state.ping,
            this.state.note,
        )
        if (Object.keys(errors).length === 0) {
            firebase
                .database()
                .ref()
                .child("/entries/" + this.props.city)
                .push(
                    // Returns an object
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
            this.setState(this.INITIAL_STATE)
            this.entryForm.reset()
            // Trigger a change event on all form inputs (fixes a bug where the input doesn't detect a change in the input when submitting a second consecutive entry.
            this.entryForm
                .querySelectorAll(".input, .textarea")
                .forEach(value => {
                    value.dispatchEvent(new Event("change", { bubbles: true }))
                })
            this.props.hideForm()
        } else {
            this.setState({
                errors: errors,
            })
        }
    }

    handleLocationSelect = address => {
        this.setState({
            location: address,
            locationSelected: true,
        })
    }

    render() {
        return (
            <form
                ref={el => (this.entryForm = el)}
                className="add-entry-form"
                onSubmit={this.onSubmit.bind(this)}
            >
                <div className={"field"}>
                    <label className={"label"}>Location</label>
                    <div className={"control"}>
                        <PlacesAutocomplete
                            inputProps={{
                                value: this.state.location,
                                onChange: location =>
                                    this.setState({
                                        location,
                                        locationSelected: true,
                                    }),
                                placeholder: "CRAVE Coffee House & Bakery",
                                maxLength: "150",
                                required: true,
                                "data-name": "location",
                            }}
                            classNames={{
                                root: "add-entry-form__autocomplete",
                                autocompleteContainer:
                                    "add-entry-form__autocomplete-results",
                                input:
                                    "input" +
                                    (this.state.errors &&
                                    this.state.errors.location
                                        ? " is-danger"
                                        : ""),
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
                    {this.state.errors && this.state.errors.location ? (
                        <p className="help is-danger">
                            {this.state.errors.location}
                        </p>
                    ) : null}
                </div>
                <div className="form__number-group field is-grouped is-grouped-centered is-grouped-multiline">
                    <div className="control form__number-input">
                        <label className="label">Download (Mbps)</label>
                        <input
                            className={
                                "input" +
                                (this.state.errors && this.state.errors.download
                                    ? " is-danger"
                                    : "")
                            }
                            data-name="download"
                            type="number"
                            min="0"
                            max="1000"
                            step="0.01"
                            placeholder="12"
                            onChange={e =>
                                this.setState({ download: e.target.value })
                            }
                            required
                        />
                        {this.state.errors && this.state.errors.download ? (
                            <p className="help is-danger">
                                {this.state.errors.download}
                            </p>
                        ) : null}
                    </div>
                    <div className="control form__number-input">
                        <label className="label">Upload (Mbps)</label>
                        <input
                            className={
                                "input" +
                                (this.state.errors && this.state.errors.upload
                                    ? " is-danger"
                                    : "")
                            }
                            data-name="upload"
                            type="number"
                            min="0"
                            max="1000"
                            step="0.01"
                            placeholder="12"
                            onChange={e =>
                                this.setState({ upload: e.target.value })
                            }
                            required
                        />
                        {this.state.errors && this.state.errors.upload ? (
                            <p className="help is-danger">
                                {this.state.errors.upload}
                            </p>
                        ) : null}
                    </div>
                    <div className="control form__number-input">
                        <label className="label">Ping (ms)</label>
                        <input
                            className={
                                "input" +
                                (this.state.errors && this.state.errors.ping
                                    ? " is-danger"
                                    : "")
                            }
                            data-name="ping"
                            type="number"
                            min="0"
                            max="500"
                            step="0.01"
                            placeholder="12"
                            onChange={e =>
                                this.setState({ ping: e.target.value })
                            }
                            required
                        />
                        {this.state.errors && this.state.errors.ping ? (
                            <p className="help is-danger">
                                {this.state.errors.ping}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="field">
                    <label className="label">Note</label>
                    <div className="control">
                        <textarea
                            className={
                                "textarea" +
                                (this.state.errors && this.state.errors.note
                                    ? " is-danger"
                                    : "")
                            }
                            data-name="note"
                            type="textarea"
                            placeholder="The food was great but the wifi was slow :'("
                            onChange={e =>
                                this.setState({ note: e.target.value })
                            }
                            maxLength="1000"
                        />
                        {this.state.errors && this.state.errors.note ? (
                            <p className="help is-danger">
                                {this.state.errors.note}
                            </p>
                        ) : null}
                    </div>
                </div>
                <div className="field-body">
                    <div className="field is-grouped is-grouped-centered">
                        <div className="control">
                            <button
                                onClick={this.checkValidation}
                                type="submit"
                                className="button is-success"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

AddEntryForm.contextTypes = {
    authUser: PropTypes.object,
}

export default AddEntryForm
