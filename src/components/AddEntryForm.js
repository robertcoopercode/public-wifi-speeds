import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

class AddEntryForm extends Component {
    constructor(props) {
        super(props);
        this.INITIAL_STATE = {
            location: "",
            download: null,
            upload: null,
            ping: null,
            note: null
        }
        this.state = this.INITIAL_STATE
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
    onSubmit = (e) => {
        e.preventDefault();
        firebase.database().ref().child('/entries/' + this.props.city).push({
            location: this.state.location,
            date: this.getCurrentDate(),
            timestamp: Date.now(),
            download: parseFloat(this.state.download),
            upload: parseFloat(this.state.upload),
            ping: parseFloat(this.state.ping),
            note: this.state.note,
            uid: this.context.authUser.uid
        });
        this.setState(this.INITIAL_STATE);
        this.entryForm.reset();
        this.props.hideForm();
    }
    // onEntryAdd = (location, download, upload, ping, note) => {
    //     firebase.database().ref().child('/entries').push({
    //         location: location,
    //         date: this.getCurrentDate(),
    //         download: parseFloat(download),
    //         upload: parseFloat(upload),
    //         ping: parseFloat(ping),
    //         note: note
    //     });
    // }

    render() {
        return (
            <form
                ref={(el) => this.entryForm = el}
                className="add-entry-form"
                onSubmit={this.onSubmit.bind(this)}>
                <div className="field">
                    <label className="label">Location</label>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Tim Hortons on Princess and MacDonnell"
                            onChange={(e) => this.setState({location: e.target.value})}
                            required/>
                    </div>
                </div>
                <div className="form__number-group field is-grouped is-grouped-centered is-grouped-multiline">
                    <div className="control form__number-input">
                        <label className="label">Download (Mbps)</label>
                        <input
                            className="input"
                            type="number"
                            min="0"
                            max="1000"
                            step="0.01"
                            placeholder="12"
                            onChange={(e) => this.setState({download: e.target.value})}
                            required/>
                    </div>
                    <div className="control form__number-input">
                        <label className="label">Upload (Mbps)</label>
                        <input
                            className="input"
                            type="number"
                            min="0"
                            max="1000"
                            step="0.01"
                            placeholder="12"
                            onChange={(e) => this.setState({upload: e.target.value})}
                            required/>
                    </div>
                    <div className="control form__number-input">
                        <label className="label">Ping (ms)</label>
                        <input
                            className="input"
                            type="number"
                            min="0"
                            max="500"
                            step="0.01"
                            placeholder="12"
                            onChange={(e) => this.setState({ping: e.target.value})}
                            required/>
                    </div>
                </div>
                <div className="field">
                    <label className="label">Notes</label>
                    <div className="control">
                  <textarea
                      className="textarea"
                      type="textarea"
                      placeholder="The food was great but the wifi was slow :'("
                      onChange={(e) => this.setState({note: e.target.value})}
                      maxLength="1000"
                      required/>
                    </div>
                </div>
                <div className="field-body">
                    <div className="field is-grouped is-grouped-centered">
                        <div className="control">
                            <button className="button is-success">
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
};

export default AddEntryForm;