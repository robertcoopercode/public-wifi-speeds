import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"

function average(entries, name, totalEntries) {
    let total = entries.reduce(function(total, entry) {
        return (total += entry[name])
    }, 0)
        return Math.round(total / totalEntries * 100) / 100
}

class Stats extends Component {
    render() {
        const totalEntries = this.props.entries.length
        const averageDownload = average(this.props.entries, "download", totalEntries)
        const averageUpload = average(this.props.entries, "upload", totalEntries)
        const averagePing = average(this.props.entries, "ping", totalEntries)

        return (
            <Fragment>
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
                            <span className="stats__name">
                                Average Download:{" "}
                            </span>
                            <span className="stats__value">
                                {averageDownload} Mbps
                            </span>
                        </div>
                        <div className="stats__group">
                            <span className="stats__name">
                                Average Upload:{" "}
                            </span>
                            <span className="stats__value">
                                {averageUpload} Mbps
                            </span>
                        </div>
                        <div className="stats__group">
                            <span className="stats__name">Average Ping: </span>
                            <span className="stats__value">
                                {averagePing} ms
                            </span>
                        </div>
                    </div>
                </article>
            </Fragment>
        )
    }
}

Stats.propTypes = {
    entries: PropTypes.arrayOf(
        PropTypes.shape({
            location: PropTypes.string.isRequired,
            download: PropTypes.number.isRequired,
            upload: PropTypes.number.isRequired,
            ping: PropTypes.number.isRequired,
        }),
    ).isRequired,
}

export default Stats
