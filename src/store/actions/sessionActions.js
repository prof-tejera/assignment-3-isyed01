import {
    LOAD_SESSION,
    LOAD_SESSION_QUEUE,
    UPDATE_SESSION,
    SET_TIME_POSITION,
    START_SESSION,
    PAUSE_SESSION,
} from './types';

import { createTimeline, queryTimeline } from '../utils/timelline'
import { updateHistory } from './historyActions'

// Gets initial time info for scanning
const getTimelineData = ({ activities, accum }) => {
    const timeline = createTimeline(activities)
    return {
        timeline,
        query: queryTimeline({ timeline, accum }),
        duration : timeline.duration
    };
}

// initialization
export const loadSession = () => (dispatch, getState) => {
    dispatch({ type: LOAD_SESSION }); 
    const { encoded, activities, accum  } = getState().session;
    const { timeline, query, duration } = getTimelineData({ activities, accum })
    const payload = { encoded, activities, timeline, query, duration, accum }
    dispatch({ type: LOAD_SESSION_QUEUE, payload }) ;
}

// Routine updates
export const updateSession = ({ encoded, activities, accum=0 }) => (dispatch, getState) => {
    const { timeline, query, duration } = getTimelineData({ activities, accum })
    const payload = { encoded, activities, timeline, query, duration, accum }
    dispatch(updateHistory({ encoded, activities, duration, accum }))
    dispatch({ type: UPDATE_SESSION, payload }) ;
}

const setTimePosition = ({ time, pause = true, lastUpdated = Date.now() }) => (dispatch, getState) => {
    const state = getState().session;
    const { timeline } = state;
    const max = timeline.to;
    const isCompleted = time >= max;
    const accum = isCompleted ? max : time;
    const isPaused = isCompleted || pause;
    const query = queryTimeline({ timeline, accum })
    const payload = { isPaused, isCompleted, accum, query, lastUpdated }
    dispatch({ type: SET_TIME_POSITION, payload });
}

const tick = () => (dispatch, getState) => {
    const state = getState().session;
    if (!state.isActive || state.isCompleted || state.isPaused) {
        const interval = clearInterval(state.interval)
        return dispatch({ type: PAUSE_SESSION, payload: { interval } });
    }
    const now = Date.now();
    const change = now - state.lastUpdated;
    const time = state.accum + change;
    dispatch(setTimePosition({ time, pause: false, lastUpdated: now }))
}

export const startSession = () => (dispatch, getState) => {
    const state = getState().session;
    const interval = setInterval(() => {dispatch(tick())}, state.intervalDelay);
    const lastUpdated = Date.now()
    const payload = { interval, lastUpdated }
    dispatch({ type: START_SESSION, payload });
};
export const stopSession = () => (dispatch, getState) => {
    const { encoded, activities, duration, accum } = getState().session
    dispatch(updateHistory({ encoded, activities, duration, accum }))
    dispatch({ type: PAUSE_SESSION });
}


export const resetSession = () => (dispatch, getState) => {
    dispatch(setTimePosition({ time: 0 }))
}

export const endSession = () => (dispatch, getState) => {
    const time = getState().session.duration
    dispatch(setTimePosition({ time }))
}


export const goPrev = () => (dispatch, getState) => {
    const state = getState().session;
    const { timeline, query } = state;
    const currentIndex = query.activity.index;
    if (currentIndex === 0) {
        dispatch(setTimePosition({ time: 0 }))
    } else {
        const index = currentIndex - 1;
        const time = timeline.activities[index].from + 0.1;
        dispatch(setTimePosition({ time }))
    }
    if(!state.isPaused) {
        dispatch(startSession())

    }
}


export const goNext = () => (dispatch, getState) => {
    const state = getState().session;
    const { timeline, query } = state;
    const currentIndex = query.activity.index;
    const maxIndex = query.activity.indexOf;
    if (currentIndex === maxIndex) {
        dispatch(endSession())
    } else {
        const time = timeline.activities[currentIndex + 1].from + 0.1;
        dispatch(setTimePosition({ time }))
        if(!state.isPaused) {
            dispatch(startSession())
    
        }
    }
}


