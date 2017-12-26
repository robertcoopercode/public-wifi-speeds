import React, {Component} from 'react';

class CitySelection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayNote: false,
            showStats: false,
            showForm: false,
            showDropdown: false
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutsideDropdown);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutsideDropdown);
    }

    handleClickOutsideDropdown = (event) => {
        if (this.dropdownRef && !this.dropdownRef.contains(event.target) && this.state.showDropdown) {
            this.setState({showDropdown: false})
        }
    }

    setDropdownRef = (node) => {
        this.dropdownRef = node;
    }

    render() {
        return (

            <div
                className={"top-section__action-button dropdown dropdown--city" + (this.state.showDropdown ? " is-active" : "")}
                ref={this.setDropdownRef}>
                <div className="dropdown-trigger" onClick={() => {
                    this.setState((previousState) => {
                        return ({showDropdown: !previousState.showDropdown})
                    })
                }}>
                    <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>{this.props.city[0].toUpperCase() + this.props.city.slice(1)}</span>
                        <span className="icon is-small">
<i className="fa fa-angle-down" aria-hidden="true"></i>
</span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        <a
                            className={"dropdown-item" + (this.props.city === 'kingston' ? ' is-active' : '')}
                            onClick={() => this.props.selectCity("kingston")}>
                            Kingston
                        </a>
                        <a className={"dropdown-item" + (this.props.city === 'montreal' ? ' is-active' : '')}
                           onClick={() => this.props.selectCity("montreal")}>
                            Montreal
                        </a>
                        <a
                            className={"dropdown-item" + (this.props.city === 'toronto' ? ' is-active' : '')}
                            onClick={() => this.props.selectCity("toronto")}>
                            Toronto
                        </a>
                        <a
                            className={"dropdown-item" + (this.props.city === 'ottawa' ? ' is-active' : '')}
                            onClick={() => this.props.selectCity("ottawa")}>
                            Ottawa
                        </a>
                    </div>
                </div>
            </div>
        )
    }
}

export default CitySelection;