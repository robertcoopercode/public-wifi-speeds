import React from "react"

function EntryNoteModal(props) {
    return (
        <div
            className={
                "modal modal--note" + (props.showNote ? " is-active" : "")
            }
        >
            <div className="modal-background" onClick={props.hideModal} />
            <div className="modal-content">
                <article className="message">
                    <div className="message-body">{props.note}</div>
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

export default EntryNoteModal
