import { combineReducers } from "redux"
import { ADD_ENTRY } from "./actions"

function todos(state = [], action) {
    switch (action.type) {
        case ADD_ENTRY:
            return Object.assign({}, state, {
                todos: [
                    ...state.todos,
                    
                ],
            })
        default:
            return state
    }
}

const todoApp = combineReducers({
    todos,
})

export default todoApp
