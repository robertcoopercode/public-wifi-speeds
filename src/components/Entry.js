// This line is required to tell the linter that the google variable will be available globally at runtime
/*global google*/

import React, { Component, Fragment } from "react"
import moment from "moment"
import * as firebase from "firebase"
import PropTypes from "prop-types"
import PlacesAutocomplete from "react-places-autocomplete"
import styled from "styled-components"

import { colors, media } from "../constants"

const Row = styled.div`
    position: relative;
    width: 100%;
    border: 2px solid black;
    border-bottom: none;
    &:nth-of-type(even) {
        background-color: ${colors.darkTableRow};
    }
    &:nth-of-type(odd) {
        background-color: ${colors.lightTableRow};
    }
    &:nth-of-type(1) {
        background-color: #ffdd57;
    }

    ${media.medium`
            border: none;
            display: flex;
            flex-flow: row nowrap;
            &:nth-of-type(even) {
            background-color: $light-color;
            }
            &:nth-of-type(odd) {
            background-color: $dark-color;
            }
            &:nth-of-type(1) {
            background-color: #ffdd57;
            }
        `};
`

const Cell = styled.div`
    display: flex;
    position: relative;
    flex-wrap: nowrap;
    flex-direction: row;
    padding: 0 !important;
    word-break: break-word;
    line-height: 1.5;
    border-bottom: 1px solid black;

    &[data-header="Location"] {
        flex-grow: 3;
    }
    &:before {
        content: attr(data-header);
        width: 40%;
        font-weight: 700;
        display: flex;
        align-items: center;
        padding: 10px;
        background-color: #ffdd57;
        ${media.small`
                width: 30%;
              `};
    }
    ${media.medium`
                border: 1px solid #2D365B;
              padding: 0.5em;
              flex-grow: 1;
              flex-basis: 0;
              &:before {
                content: none;
              }
            `};
`
const DateCell = styled.div`
    padding: 0.5em !important;
    width: 100%;
`
const EditCell = Cell.extend`
    padding: 0 !important;
    background-color: rgba(0, 209, 178, 0.22);
`
const CellInput = styled.input`
    background: none;
    border: none !important;
    padding: 0.5em;
    font-size: 1rem;
    width: 100%;
    height: 100%;
`
const ErrorCell = Cell.extend`
    background-color: rgba(255, 56, 96, 0.25);
`
const CellText = styled.span`
    padding: 0.5em;
    width: 100%;
`
const Indicators = styled.div`
    height: calc(100% - 1px);
    position: absolute;
    width: 100%;
    right: 0;
    top: 0;

    ${media.medium`
                height: calc(100% - 2px);
                right: 1px;
                top: 1px;
                width: 300px;
            `};
`
const Overlay = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: rgba(0, 0, 0, 0.59);
    padding: 0 20px;
    float: left;
    width: 100%;
    position: absolute;
    right: 0;

    ${media.medium`
                width: 300px;
            `};
`
const Form = styled.form`
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    flex-direction: column;

    ${media.medium`
                flex-direction: row;
            `};
`
const Indicator = styled.div`
    width: 5px;
    height: 100%;
    float: right;
    position: relative;
`
const NoteIndicator = Indicator.extend`
    background-color: #209cee;
`
const UserEntryIndicator = Indicator.extend`
    background-color: #00d1b2;
`
const Button = styled.button`
    margin: 0 10px;
`
const SaveContainer = styled.div`
    position: absolute !important;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 42px;
    bottom: -41px;
    z-index: 1;
    width: 100%;
    background-color: #2d365b;
`
const Error = styled.p`
    display: none;

    ${media.medium`
            top: -32px;
            font-size: 0.75rem;
            position: absolute;
            border-radius: 5px 5px 0 0;
            height: 30px;
            background-color: #FF385E;
            color: #ffffff;
            display: flex;
            align-items: center;
            width: 98%;
            left: 1%;
            justify-content: center;
            margin-top: 0;
        `};
`

class Entry extends Component {
    state = {
        showOverlay: false,
        errors: null,
        locationSelected: true,
        editEntry: false,
        date: this.props.entry.date,
        location: this.props.entry.location,
        download: this.props.entry.download,
        upload: this.props.entry.upload,
        ping: this.props.entry.ping,
        note: this.props.entry.note,
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
        return moment(new Date()).format("DD/MM/YYYY")
    }

    handleLocationSelect = address => {
        this.setState({
            location: address,
            locationSelected: true,
        })
    }

    render() {
        return (
            <Row>
                {!this.state.editEntry ? (
                    <Fragment>
                        <Cell data-header="Date">
                            <CellText>{this.props.entry.date}</CellText>
                        </Cell>
                        <Cell data-header="Location">
                            <CellText>{this.props.entry.location}</CellText>
                        </Cell>
                        <Cell data-header="Download (Mbps)">
                            <CellText>{this.props.entry.download}</CellText>
                        </Cell>
                        <Cell data-header="Upload (Mbps)">
                            <CellText>{this.props.entry.upload}</CellText>
                        </Cell>
                        <Cell data-header="Ping (ms)">
                            <CellText>{this.props.entry.ping}</CellText>
                        </Cell>

                        <Indicators
                            onMouseEnter={() =>
                                this.setState({ showOverlay: true })
                            }
                            onTouchEnd={() =>
                                this.setState(prevState => {
                                    return {
                                        showOverlay: !prevState.showOverlay,
                                    }
                                })
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
                                <Overlay
                                    onMouseLeave={() =>
                                        this.setState({ showOverlay: false })
                                    }
                                >
                                    {this.props.entry.note.length > 0 ? (
                                        <Button
                                            className={
                                                "button is-small is-info"
                                            }
                                            onClick={() =>
                                                this.props.showNote(
                                                    this.props.entry.note,
                                                )
                                            }
                                        >
                                            Note
                                        </Button>
                                    ) : null}
                                    {this.context.authUser.uid ===
                                    this.props.entry.uid ? (
                                        <Fragment>
                                            <Button
                                                className="button is-small is-primary"
                                                onClick={() =>
                                                    this.setState({
                                                        editEntry: true,
                                                        showOverlay: false,
                                                    })
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                className="button is-small is-danger"
                                                onClick={() =>
                                                    this.deleteItem(
                                                        this.props.entry.id,
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </Fragment>
                                    ) : null}
                                </Overlay>
                            ) : null}

                            {this.props.entry.note.length > 0 ? (
                                <NoteIndicator />
                            ) : null}
                            {this.context.authUser.uid ===
                            this.props.entry.uid ? (
                                <UserEntryIndicator />
                            ) : null}
                        </Indicators>
                    </Fragment>
                ) : (
                    <Form
                        innerRef={element => {
                            this.editForm = element
                        }}
                        onSubmit={e => this.updateItem(e, this.props.entry.id)}
                    >
                        <Cell data-header="Date">
                            <DateCell>{this.props.entry.date}</DateCell>
                        </Cell>
                        {this.state.errors && this.state.errors.location ? (
                            <ErrorCell data-header="Location">
                                <Error>Invalid</Error>
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
                                        root: "autocomplete",
                                        autocompleteContainer:
                                            "autocomplete-results",
                                        input: "autocomplete-table-input",
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
                            </ErrorCell>
                        ) : (
                            <EditCell data-header="Location">
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
                                        root: "autocomplete",
                                        autocompleteContainer:
                                            "autocomplete-results",
                                        input: "autocomplete-table-input",
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
                            </EditCell>
                        )}
                        {this.state.errors && this.state.errors.download ? (
                            <ErrorCell data-header="Download">
                                <Error>Invalid</Error>
                                <CellInput
                                    data-name="download"
                                    type={"number"}
                                    min="0"
                                    max="1000"
                                    step="0.01"
                                    value={this.state.download}
                                    onChange={e =>
                                        this.setState({
                                            download: e.target.value,
                                        })
                                    }
                                />
                            </ErrorCell>
                        ) : (
                            <EditCell data-header="Download">
                                <CellInput
                                    data-name="download"
                                    type={"number"}
                                    min="0"
                                    max="1000"
                                    step="0.01"
                                    value={this.state.download}
                                    onChange={e =>
                                        this.setState({
                                            download: e.target.value,
                                        })
                                    }
                                />
                            </EditCell>
                        )}
                        {this.state.errors && this.state.errors.upload ? (
                            <ErrorCell data-header="Upload">
                                <Error>Invalid</Error>
                                <CellInput
                                    data-name="upload"
                                    type="number"
                                    min="0"
                                    max="1000"
                                    step="0.01"
                                    value={this.state.upload}
                                    onChange={e =>
                                        this.setState({
                                            upload: e.target.value,
                                        })
                                    }
                                />
                            </ErrorCell>
                        ) : (
                            <EditCell data-header="Upload">
                                <CellInput
                                    data-name="upload"
                                    type="number"
                                    min="0"
                                    max="1000"
                                    step="0.01"
                                    value={this.state.upload}
                                    onChange={e =>
                                        this.setState({
                                            upload: e.target.value,
                                        })
                                    }
                                />
                            </EditCell>
                        )}
                        {this.state.errors && this.state.errors.ping ? (
                            <ErrorCell data-header="Ping">
                                <Error>Invalid</Error>
                                <CellInput
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
                            </ErrorCell>
                        ) : (
                            <EditCell data-header="Ping">
                                <CellInput
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
                            </EditCell>
                        )}
                        <SaveContainer>
                            <button
                                className={"button is-small is-success"}
                                onClick={this.checkValidation}
                            >
                                Save
                            </button>
                        </SaveContainer>
                    </Form>
                )}
            </Row>
        )
    }
}

Entry.contextTypes = {
    authUser: PropTypes.object,
}

export default Entry
