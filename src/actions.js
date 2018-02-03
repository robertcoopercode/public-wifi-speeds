/*
 * action types
 */

export const ADD_ENTRY = "ADD_ENTRY"
export const SELECT_CITY = "SELECT_CITY"

/*
 * other constants
 */

// export const VisibilityFilters = {
//     SHOW_ALL: 'SHOW_ALL',
//     SHOW_COMPLETED: 'SHOW_COMPLETED',
//     SHOW_ACTIVE: 'SHOW_ACTIVE'
// }

/*
 * action creators
 */

export function addEntry(
    location,
    date,
    timestamp,
    download,
    upload,
    ping,
    note,
    uid,
) {
    return {
        type: ADD_ENTRY,
        location,
        date,
        timestamp,
        download,
        upload,
        ping,
        note,
        uid,
    }
}

export function selectCity(selectedCity, coordinates) {
    return {
        type: SELECT_CITY,
        selectedCity,
        coordinates,
    }
}
