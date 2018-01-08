import React, { Component } from "react"
import { capitalize } from "../utils"

class CitySelection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDropdown: false,
        }
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutsideDropdown)
    }

    componentWillUnmount() {
        document.removeEventListener(
            "mousedown",
            this.handleClickOutsideDropdown,
        )
    }

    handleClickOutsideDropdown = e => {
        const dropdown = this.dropdownRef && !this.dropdownRef.contains(e.target) && this.state.showDropdown;
        if (dropdown) {
            this.setState({ showDropdown: false })
        }
    }

    setDropdownRef = node => {
        this.dropdownRef = node
    }

    render() {
        return (
            <div
                className={
                    "dropdown dropdown--city" +
                    (this.state.showDropdown ? " is-active" : "")
                }
                ref={this.setDropdownRef}
            >
                <div
                    className="dropdown-trigger"
                    onClick={() => {
                        this.setState(previousState => {
                            return { showDropdown: !previousState.showDropdown }
                        })
                    }}
                >
                    <button
                        className="button"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                    >
                        <span>{capitalize(this.props.city)}</span>
                        <span className="icon is-small">
                            <i
                                className="fa fa-angle-down"
                                aria-hidden="true"
                            />
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.city === "kingston"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.props.selectCity("kingston", {
                                    latitude: 44.2312,
                                    longitude: -76.486,
                                })
                            }
                        >
                            Kingston
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.city === "montreal"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.props.selectCity("montreal", {
                                    latitude: 45.5017,
                                    longitude: -73.5673,
                                })
                            }
                        >
                            Montreal
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.city === "toronto"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.props.selectCity("toronto", {
                                    latitude: 43.6532,
                                    longitude: -79.3832,
                                })
                            }
                        >
                            Toronto
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.city === "ottawa"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.props.selectCity("ottawa", {
                                    latitude: 45.4215,
                                    longitude: -75.6972,
                                })
                            }
                        >
                            Ottawa
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default CitySelection
