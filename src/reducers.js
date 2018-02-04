import { combineReducers } from "redux"
import { LOAD_ENTRIES, ADD_ENTRY, SELECT_CITY, SORT_ENTRIES } from "./actions"

function entries(state = [], action) {
    switch (action.type) {
        case LOAD_ENTRIES:
            return action.entries
        case ADD_ENTRY:
            return [...state, action.entry]
        default:
            return state
    }
}

function city(
    state = {
        selectedCity: "kingston",
        coordinates: {
            latitude: 44.2312,
            longitude: -76.486,
        },
    },
    action,
) {
    switch (action.type) {
        case SELECT_CITY:
            return {
                selectedCity: action.selectedCity,
                coordinates: {
                    latitude: action.coordinates.latitude,
                    longitude: action.coordinates.longitude,
                },
            }
        default:
            return state
    }
}

function sort(state = { currentOrder: {}, lastSorted: "location" }, action) {
    switch (action.type) {
        case SORT_ENTRIES:
            let order = Object.assign({}, state.currentOrder, {
                [action.field]: action.order,
            })
            return Object.assign({}, state, {
                currentOrder: order,
                lastSorted: action.field,
            })
        default:
            return state
    }
}

const appReducers = combineReducers({
    entries,
    city,
    sort,
})

export default appReducers
