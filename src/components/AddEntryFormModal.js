import React from "react"

import AddEntryForm from "./AddEntryForm"

function AddEntryFormModal(props) {
    return (
        <div
            className={
                "modal modal--form" + (props.showForm ? " is-active" : "")
            }
        >
            <div className="modal-background" onClick={props.hideModal} />
            <div className="modal-content">
                <article className="message is-dark">
                    <div className="message-header">
                        <p>Add New Entry</p>
                    </div>
                    <div className="message-body">
                        <AddEntryForm
                            hideForm={props.hideModal}
                            city={props.selectedCity}
                            cityCoordinates={props.coordinates}
                            sanitizeInputs={props.sanitizeInputs}
                            validateInputs={props.validateInputs}
                        />
                    </div>
                </article>
            </div>
            <button
                className="modal-close is-large"
                aria-label="close"
                onClick={props.hideModal}
            />
        </div>
    )
}

export default AddEntryFormModal
