import { DataHelper } from "../utils//DataHelper";
import {
    LOAD_HISTORY,
    ADD_HISTORY,
    UPDATE_HISTORY,
    REMOVE_HISTORY,
} from '../actions/types';

const data = new DataHelper({
    id: 'history',
    definition: {
        items: [
            { 
                id: 0, 
                timestamp: 0, 
                encoded: '', 
                activities:[
                    { id:null, name:'', description:``, ascending:1, rounds:1, activeTime:0, restTime:0, duration:0 }
                ],
                duration:0,
                accum: 0 
            },
        ],
    }
});

const initialState = {
    isReady: false,
    items: []
};

const nextId = ({ state }) => state.items.reduce((accum, item) => item.id > accum ? item.id : accum, 0) + 1;
const sortComapre = (a, b) => b.timestamp-a.timestamp;

const historyReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_HISTORY: return data.readWrite({ ...state, isReady: true });

        case ADD_HISTORY: return data.write({
            ...state, 
            items: [{ id: nextId({ state }), timestamp: Date.now(), ...action.payload }, ...state.items]
        });
        
        case UPDATE_HISTORY: return data.write({
            ...state, 
            items: [
                ...state.items.map(item => item.id === action.payload.id ? { ...item, timestamp: Date.now(), ...action.payload } :item)
            ].sort(sortComapre)
        });
        
        case REMOVE_HISTORY: return data.write({ ...state, items: [...state.items.filter(item => item.id !== action.payload.id)] });
        
        default: return state;
    }
}


export default historyReducer;