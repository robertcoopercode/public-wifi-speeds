import React, { Component } from "react"

class MobileSort extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showDropdown: false,
            dropdownTitle: "Sort Entries",
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

    handleClickOutsideDropdown = event => {
        if (
            this.dropdownRef &&
            !this.dropdownRef.contains(event.target) &&
            this.state.showDropdown
        ) {
            this.setState({ showDropdown: false })
        }
    }

    setDropdownRef = node => {
        this.dropdownRef = node
    }

    selectSort = (field, ascendingOrder, dropdownTitle) => {
        this.setState({ dropdownTitle })
        this.props.handleSort(field, ascendingOrder)
    }

    render() {
        return (
            <div
                className={
                    "summary-section__action-button dropdown dropdown--sort" +
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
                        <span>{this.state.dropdownTitle}</span>
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
                                (this.props.sortField === "timestamp"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.selectSort(
                                    "timestamp",
                                    false,
                                    "Most Recent",
                                )
                            }
                        >
                            Most Recent
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.sortField === "location"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.selectSort(
                                    "location",
                                    true,
                                    "Location (Alphabetical)",
                                )
                            }
                        >
                            Location (Alphabetical)
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.sortField === "download"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.selectSort(
                                    "download",
                                    false,
                                    "Fastest Download",
                                )
                            }
                        >
                            Fastest Download
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.sortField === "upload"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.selectSort(
                                    "upload",
                                    false,
                                    "Fastest Upload",
                                )
                            }
                        >
                            Fastest Upload
                        </a>
                        <a
                            className={
                                "dropdown-item" +
                                (this.props.sortField === "ping"
                                    ? " is-active"
                                    : "")
                            }
                            onClick={() =>
                                this.selectSort("ping", true, "Fastest Ping")
                            }
                        >
                            Fastest Ping
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default MobileSort
