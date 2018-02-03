/*
 * action types
 */

export const ADD_ENTRY = "ADD_ENTRY"

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
