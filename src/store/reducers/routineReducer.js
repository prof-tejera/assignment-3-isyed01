import {
    LOAD_ROUTINE,
    REORDER_QUEUE,
    UPDATE_ROUTINE,
    ADD_ACTIVITY,
    REMOVE_ACTIVITY,
} from '../actions/types';
import { initialState as activitiesState } from './activitiesReducer'
import { DataHelper } from "../utils//DataHelper";

export const data = new DataHelper({
    id: 'routine',
    definition: {
        activities: [
            { id: null, name: '', description: ``, ascending: 1, rounds: 1, activeTime: 0, restTime: 0, duration: 0 }
        ],
        queue: null,
        duration: 0
    }
});

const initialState = {
    isReady: false,
    activities: [...activitiesState.list],
    queue: [...activitiesState.list.map(item => item.id)],
    duration: activitiesState.list.reduce((accum, item) => accum + item.duration, 0),
    activityQueue: [...activitiesState.list], // not stored (only for runtime)
};

const routineReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ROUTINE: return data.readWrite({ ...state, isReady: true });
        case REORDER_QUEUE: return data.write({ ...state, ...action.payload });
        case UPDATE_ROUTINE: return data.write({ ...state, ...action.payload });
        case ADD_ACTIVITY: return data.write({ ...state, ...action.payload });
        case REMOVE_ACTIVITY: return data.write({ ...state, ...action.payload });
        default: return state;
    }
}

export default routineReducer;