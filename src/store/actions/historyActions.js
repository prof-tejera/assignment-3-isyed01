import {
    LOAD_HISTORY,
    ADD_HISTORY,
    UPDATE_HISTORY,
    REMOVE_HISTORY,
} from './types';

const getNextId = () => (dispatch, getState) => {
    return getState().history.items.reduce((accum, item)=> item.id>accum ? item.id : accum ,0) + 1;
}


export const loadHistory = () => (dispatch, getState) => {
    dispatch({ type: LOAD_HISTORY });
}

export const updateHistory = ({ encoded, activities, duration, accum }) => (dispatch, getState) => {
    const historyItems = getState().history.items;
    if(historyItems.length>0){
        const mostRecentItem = getState().history.items[0];
        if(mostRecentItem.encoded===encoded){
            const payload = { id:mostRecentItem.id, encoded, activities, duration, accum };
            dispatch({ type: UPDATE_HISTORY, payload });
            return getState().history.items[0];
        }
    }
    const id = dispatch( getNextId() )
    const payload = { id, encoded, activities, duration, accum };
    dispatch({ type: ADD_HISTORY, payload });
    return getState().history.items[0];
}

export const removeHistory = (id) => (dispatch, getState) => {
    const payload = { id };
    dispatch({ type: REMOVE_HISTORY, payload });
}

