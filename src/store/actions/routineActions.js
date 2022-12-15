import {
    LOAD_ROUTINE,
    REORDER_QUEUE,
    UPDATE_ROUTINE,
    ADD_ACTIVITY,
    REMOVE_ACTIVITY,
} from './types';

import { data } from '../reducers/routineReducer';
import { createActivity } from './activitiesActions'

export const loadRoutine = () => (dispatch, getState) => {
    dispatch({ type: LOAD_ROUTINE });
    const { activities, queue } = getState().routine;
    const activityQueue = queue.map(id=> activities.find(item=>item.id===id) )
    const payload = { activityQueue }
    dispatch({ type: UPDATE_ROUTINE, payload });
}

export const addActivity = (id) => (dispatch, getState) => {
    const { list } = getState().activities;
    const activity = list.find(item=>item.id===id);
    const queue = [ ...getState().routine.queue, id];
    const activityQueue = [ ...getState().routine.activityQueue, activity];
    const activities = queue.reduce((accum, id)=>
        accum.find(item=>item.id===id) ? accum :  [ ...accum, list.find(item=>item.id===id) ]
    ,[])
    const duration = activityQueue.reduce((accum, activity)=> accum+activity.duration,0)
    const payload = { activities, queue, activityQueue, duration }
    dispatch({ type: ADD_ACTIVITY, payload });
}

export const removeActivity = (index) => (dispatch, getState) => {
    const { list } =  getState().activities;
    const { queue, activityQueue } = getState().routine;
    queue.splice(index, 1);
    activityQueue.splice(index, 1);
    const activities = queue.reduce((accum, id)=>
        accum.find(item=>item.id===id) ? accum :  [ ...accum, list.find(item=>item.id===id) ]
    ,[])
    const duration = activityQueue.reduce((accum, activity)=> accum+activity.duration,0)
    const payload = { activities, queue, activityQueue, duration }
    dispatch({ type: REMOVE_ACTIVITY, payload });
}

export const removeAllActivities = (index) => (dispatch, getState) => {
    const payload = { activities:[], queue:[], activityQueue:[], duration:0 }
    dispatch({ type: REMOVE_ACTIVITY, payload });
}

export const reorderQueueu = (activityQueue) => (dispatch, getState) => {
    const queue = activityQueue.map(activity=>activity.id);
    const payload = { queue, activityQueue }
    dispatch({ type: REORDER_QUEUE, payload });
}

export const encodeRoutine = () => (dispatch, getState) => {
    return data.encode(getState().routine)
}



// used as a side-effect for when an activity is modified
export const updateRoutineActivities = () => (dispatch, getState) => {
    const { list } = getState().activities;
    const queue = getState().routine.queue.filter(id => list.find(activity=>activity.id===id) ? true : false );
    const activities = queue.reduce((accum, id)=>
        accum.find(item=>item.id===id) ? accum :  [ ...accum, list.find(item=>item.id===id) ]
    ,[]);
    const activityQueue = queue.map(id=> activities.find(item=>item.id===id) )
    const duration = activityQueue.reduce((accum, activity)=> accum+activity.duration,0)
    const payload = { activities, queue, activityQueue, duration }
    dispatch({ type: UPDATE_ROUTINE, payload });
}

// when comparing, don't care about the ID
const compareActivity = ({ activity, localActivity }) => {
    return Object.keys(activity).reduce((accum, prop) => (
        prop === 'id' || activity[prop] === localActivity[prop] ?
            accum :
            false
    ), true)
}
const scanActivity = ({ activity, localActivities }) => {
    return localActivities.find(localActivity => compareActivity({ activity, localActivity }))
}
const scanActivities = ({ activities }) => (dispatch, getState) => {
    const localActivities = getState().activities.list;
    return activities.map(activity=> ({ activity, match:scanActivity({ activity, localActivities })}) )
}


const validateStructure = (decodedData) => {
    if(!decodedData.activities) return false;
    if(!Array.isArray(decodedData.activities)) return false;
    if(!decodedData.queue) return false;
    if(!Array.isArray(decodedData.queue)) return false;
    const { activities, queue } = decodedData;
    return queue.find(id=> activities.find(activity => activity.id===id)===undefined ) ? false : true
}


const processParamData = (decodedData)  => (dispatch, getState) => {
    const scanResults = dispatch( scanActivities({ activities:decodedData.activities }) )
    scanResults.forEach(result=>{
        if(result.match===undefined){
            const lastIndex = getState().activities.list.reduce((accum, item)=> item.id>accum ? item.id : accum ,0)
            dispatch( createActivity(result.activity) )
            result.match = getState().activities.list.find(item=>item.id===lastIndex+1)
        }
    })
    const activities = scanResults.reduce((accum, result)=> accum.find(item=>item.id===result.match.id) ? accum : [...accum, result.match ] ,[]);
    const queue = decodedData.queue.map(id=> scanResults.find(item=>item.activity.id===id).match.id )
    const activityQueue = queue.map(id=>activities.find(item=>item.id===id))
    const duration = activityQueue.reduce((accum, activity)=> accum+activity.duration,0)
    const payload = { activities, queue, activityQueue, duration }
    dispatch({ type: UPDATE_ROUTINE, payload });
    return payload;
}

export const decodeRoutine = (param) => (dispatch, getState) => {
    const encodedState = data.encode(getState().routine);
    if(param===encodedState) return { match: true, param, data:getState().routine };
    // no param
    if(!param) return { match:false, param:encodedState };
    const decodedData = data.decode(param)
        // invalid data
    if(!decodedData) return { match:false, param:encodedState };
    const isValid = validateStructure(decodedData)
    // Data structure is invalid
    if(!isValid) return { match:false, param:encodedState };
    const processedData = dispatch( processParamData(decodedData) );
    return { match: true, param, data:processedData };
    
}

