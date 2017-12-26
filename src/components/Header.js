import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <h1 className="header__title">Wifi Speeds → Kingston</h1>
        <button
          className="header__button button"
          onClick={this.props.showStats}>
            Show Stats
        </button>
      </header>
    )
  }
}

Header.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    location: PropTypes.string.isRequired,
    download: PropTypes.number.isRequired,
    upload: PropTypes.number.isRequired,
    ping: PropTypes.number.isRequired
  })).isRequired
}

export default Header;