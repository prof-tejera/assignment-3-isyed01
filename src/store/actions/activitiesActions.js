import {
    LOAD_ACTIVITIES,
    REORDER_ACTIVITIES,
    CREATE_ACTIVITY,
    UPDATE_ACTIVITY,
    DELETE_ACTIVITY,
} from './types';

import { CHAR_ELLIPSIS, ACTIVITY_NAME_MAX_CHARS } from '../../constants';


const getNextId = () => (dispatch, getState) => {
    return getState().activities.list.reduce((accum, item)=> item.id>accum ? item.id : accum ,0) + 1;
}

const createSequentialName = ({ name, id }) => {
    const suffix = `${CHAR_ELLIPSIS} (${id})`;
    const chars = ACTIVITY_NAME_MAX_CHARS - suffix.length;
    const cleansedName = name.split(CHAR_ELLIPSIS)[0];
    const prefix = cleansedName.substr(0,chars);
    return `${prefix}${suffix}`
}

export const loadActivities = () => (dispatch, getState) => {
    if(getState().activities.isReady) return;
    dispatch({ type: LOAD_ACTIVITIES });
}

export const reorderActivities = (list) => (dispatch, getState) => {
    const payload = { list }
    dispatch({ type: REORDER_ACTIVITIES, payload });
}

export const createActivity = ({ name=null, description='', ascending=1, rounds=1, activeTime=0, restTime=0 }) => (dispatch, getState) => {
    const id = dispatch( getNextId() )
    name = name===null ? createSequentialName({ name:'Activity', id }) : name;
    const duration = (activeTime + restTime) * rounds;
    const payload = { id, name, description, ascending, rounds, activeTime, restTime, duration }
    dispatch({ type: CREATE_ACTIVITY, payload });
    return payload;
}

export const updateActivity = ({ id, name, description, ascending, rounds, activeTime, restTime  }) => (dispatch, getState) => {
    const duration = (activeTime + restTime) * rounds;
    const payload = { id, name, description, ascending, rounds, activeTime, restTime, duration  }
    dispatch({ type: UPDATE_ACTIVITY, payload });
}

export const deleteActivity = (id) => (dispatch, getState) => {
    const payload = { id }
    dispatch({ type: DELETE_ACTIVITY, payload });
}

export const cloneActivity = (activityId) => (dispatch, getState) => {
    const activity = getState().activities.list.find(activity=>activity.id===activityId)
    const id = dispatch( getNextId() )
    const name = createSequentialName({ name:activity.name, id })
    const payload = { ...activity, id, name }
    dispatch({ type: CREATE_ACTIVITY, payload });
    return payload;
}