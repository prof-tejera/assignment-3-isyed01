import {
    LOAD_SESSION,
    LOAD_SESSION_QUEUE,
    UPDATE_SESSION,
    // Main
    SET_TIME_POSITION,
    START_SESSION,
    PAUSE_SESSION,
    RESET_SESSION,
    END_SESSION,
} from '../actions/types';
import { DataHelper } from "../utils//DataHelper";

export const data = new DataHelper({
    id: 'session',
    definition: {
        encoded: '',
        activities: [
            { id: null, name: '', description: ``, ascending: 1, rounds: 1, activeTime: 0, restTime: 0, duration: 0 }
        ],
        accum: 0,
    }
});

const initialState = {
    encoded: '',
    isReady: false,
    // sourced from routine
    activities: [],

    // used for runtime
    interval: null,
    intervalDelay: 1,
    timeline: { activities: [] },
    duration: 0,
    query: null,  // Last resultset of timeline query

    // state status
    accum: 0,
    startTime: null,
    lastUpdated: Date.now(),
    isActive: false, // Did we ever hit 'Play'?
    isPaused: false,
    isCompleted: false,
};


const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        // for initialization only
        case LOAD_SESSION: return data.readWrite({ ...state });
        case LOAD_SESSION_QUEUE: return data.write({ ...state, isReady: true, ...action.payload });

        // for runtime
        case UPDATE_SESSION: return data.write({ ...state, isReady: true, ...action.payload, });

        // CONTROLS
        case START_SESSION: return data.write({ ...state, ...action.payload, isActive: true, isPaused: false });
        case SET_TIME_POSITION:
            return data.write({ ...state, ...action.payload });
        case PAUSE_SESSION:
            return data.write({ ...state, ...action.payload, isPaused: true });
        case RESET_SESSION:
            return data.write({ ...state, ...action.payload, isPaused: true, isCompleted: false });
        case END_SESSION:
            return data.write({ ...state, ...action.payload, isPaused: true, isCompleted: true });
        default: return state;
    }
}


export default sessionReducer;