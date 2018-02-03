import React from "react"
import ReactDOM from "react-dom"
import registerServiceWorker from "./registerServiceWorker"
import { BrowserRouter } from "react-router-dom"
import { createStore } from "redux"
import { Provider } from "react-redux"

import "./fire"
import App from "./components/App"
import todoApp from "./reducers"

const store = createStore(
    todoApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__(),
)

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root"),
)
registerServiceWorker()
