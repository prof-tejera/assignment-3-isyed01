import { DataHelper } from "../utils//DataHelper";
import {
    LOAD_ACTIVITIES,
    REORDER_ACTIVITIES,
    CREATE_ACTIVITY,
    UPDATE_ACTIVITY,
    DELETE_ACTIVITY,
} from '../actions/types';

const data = new DataHelper({ 
    id:'activities', 
    definition:{
        list: [
            { id:null, name:'', description:``, ascending:1, rounds:1, activeTime:0, restTime:0, duration:0 }
        ],
    } 
});

export const initialState = {
    isReady:false,
    list:[
        { id:0, name:'Stopwatch', description:`Count up from 0s`, ascending:1, rounds:1, activeTime:5000, restTime:0, duration:5000 },
        { id:1, name:'Countdown', description:'Count down to 0s', ascending:0, rounds:1, activeTime:4000, restTime:0, duration:4000 },
        { id:2, name:'XY', description:'Count down to 0s, N times', ascending:0, rounds:10, activeTime:3000, restTime:0, duration:30000 },
        { id:3, name:'Tabata', description:'Count down to 0s, twice, N times', ascending:0, rounds:8, activeTime:2000, restTime:1000, duration:24000 },
    ]
};

const nextId = ({ state }) => state.list.reduce((accum,item)=> item.id>accum ? item.id : accum , 0) +1;

const activityReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ACTIVITIES: return data.readWrite({ ...state, isReady:true });
        case REORDER_ACTIVITIES: return data.write({ ...state, list:[...action.payload.list] });
        case CREATE_ACTIVITY: return data.write({ 
            ...state, 
            list: [ { ...action.payload, id:nextId({ state }) }, ...state.list ]  
        });
        case UPDATE_ACTIVITY: return data.write({ 
            ...state,
            list: state.list.map(
                item => item.id === action.payload.id ? { ...item, ...action.payload } : item
            )
        });

        case DELETE_ACTIVITY: return data.write({ 
            ...state,
            list: [ ...state.list.filter(item => item.id !== action.payload.id) ]
        });

        default: return state;
    }
}


export default activityReducer;