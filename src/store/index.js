//import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import activitiesReducer from './reducers/activitiesReducer';
import routineReducer from './reducers/routineReducer';
import sessionReducer from './reducers/sessionReducer';
import historyReducer from './reducers/historyReducer';

const initialState = {}
const middleware = [thunk];


const rootReducer = combineReducers({
    activities: activitiesReducer,
    routine: routineReducer,
    session: sessionReducer,
    history: historyReducer,
});

// PRODUCTION
export const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

/*
export const store = PRODUCTION ? createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware)
    )
)
:
createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()) || window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    )
);

*/