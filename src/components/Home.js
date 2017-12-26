import React, {Component} from 'react';
import CitySelection from './CitySelection';
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
        }
    }

    componentDidMount() {
        document.title = "Wifi Speeds - " + this.state.city[0].toUpperCase() + this.state.city.slice(1)
        this.fetchEnries(this.state.city)
    }

    sort = (field, ascending) => {
        const databaseReference = firebase.database().ref('/entries/' + this.state.city).orderByChild(field);
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
            if (!ascending) {
                entries.reverse();
            }
            this.setState({entries: entries});
        })
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

    fetchEnries = (city) => {
        /* Create reference to entries in Firebase Database */
        const databaseReference = firebase.database().ref('/entries/' + city).orderByChild('location');
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
            // console.log(entries.reverse());
            this.setState({entries: entries});
        })
    }

    selectCity = (name) => {
        document.title = "Wifi Speeds - " + name[0].toUpperCase() + name.slice(1)
        this.fetchEnries(name)
        this.setState({city: name})
    }

    signout = () => {
        firebase.auth().signOut().then(function () {
        }).catch(function (error) {
            console.log("Error: " + error);
        });
    }

    render() {
        return (
            <div className={"home"}>
                <div className={"home__logout-container"}>
                    <a className="home__logout-button button is-danger" onClick={this.signout}>Signout</a>
                </div>
                <div className={"top-section home__top-section"}>
                    <h2 className={"top-section__title"}>Wifi Speeds for {this.state.city}</h2>
                    <div className={"top-section__action-buttons"}>
                        <button className={"top-section__action-button button is-primary"}
                                onClick={() => this.setState({showForm: true})}>Add New Entry
                        </button>
                        <button className={"top-section__action-button button is-info"}
                                onClick={() => this.setState({showStats: true})}>Overall Stats
                        </button>
                        <CitySelection className="test" city={this.state.city} selectCity={this.selectCity} />
                    </div>
                </div>

                <EntriesTable
                    entries={this.state.entries}
                    city={this.state.city}
                    sort={this.sort}
                    showNote={this.showNote}
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
                                <AddEntryForm hideForm={() => this.setState({showForm: false})} city={this.state.city}/>
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
                        <article class="message">
                            <div class="message-body">
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
