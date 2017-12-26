import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Stats extends Component {
  render() {
    let totalEntries = this.props.entries.length;
    function average(entries, name) {
      let total = entries.reduce(function(total, entry) {
        return total += entry[name];
      }, 0);
      return Math.round((total / totalEntries)*100)/100;
    };
    let averageDownload = average(this.props.entries, "download");
    let averageUpload = average(this.props.entries, "upload");
    let averagePing = average(this.props.entries, "ping");
    return (
        <React.Fragment>
            <article className="stats message is-info">
                <div className="message-header">
                    <p>Stats</p>
                </div>
                <div className="message-body">
                    <div className="stats__group">
                        <span className="stats__name">Entries: </span>
                        <span className="stats__value">{totalEntries}</span>
                    </div>
                    <div className="stats__group">
                        <span className="stats__name">Average Download: </span>
                        <span className="stats__value">{averageDownload} Mbps</span>
                    </div>
                    <div className="stats__group">
                        <span className="stats__name">Average Upload: </span>
                        <span className="stats__value">{averageUpload} Mbps</span>
                    </div>
                    <div className="stats__group">
                        <span className="stats__name">Average Ping: </span>
                        <span className="stats__value">{averagePing} ms</span>
                    </div>
                </div>
            </article>
        </React.Fragment>
    )
  }
}

Stats.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    location: PropTypes.string.isRequired,
    download: PropTypes.number.isRequired,
    upload: PropTypes.number.isRequired,
    ping: PropTypes.number.isRequired
  })).isRequired
}

export default Stats;