import { combineReducers } from "redux"
import { ADD_ENTRY, SELECT_CITY } from "./actions"

function entries(state = [], action) {
    switch (action.type) {
        case ADD_ENTRY:
            return Object.assign({}, state, {
                entries: [...state.entries],
            })
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

const appReducers = combineReducers({
    entries,
    city,
})

export default appReducers
