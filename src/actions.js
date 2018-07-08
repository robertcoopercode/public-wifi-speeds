/*
 * action types
 */

export const LOAD_ENTRIES = "LOAD_ENTRIES"
export const ADD_ENTRY = "ADD_ENTRY"
export const SELECT_CITY = "SELECT_CITY"
export const SORT_ENTRIES = "SORT_ENTRIES"
export const SET_USER = "SET_USER"

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

export function loadEntries(entries) {
    return {
        type: LOAD_ENTRIES,
        entries,
    }
}

export function addEntry(entry) {
    return {
        type: ADD_ENTRY,
        entry,
    }
}

export function selectCity(selectedCity, coordinates) {
    return {
        type: SELECT_CITY,
        selectedCity,
        coordinates,
    }
}

export function sortEntries(field, order) {
    return {
        type: SORT_ENTRIES,
        field,
        order,
    }
}

export function setUser(user) {
    return {
        type: SET_USER,
        user,
    }
}
