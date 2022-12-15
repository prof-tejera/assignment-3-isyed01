
import { SECOND_MS, MINUTE_MS, HOUR_MS } from '../constants'

export const zerofill = (numDigits, value) => `000${value}`.slice(-numDigits);
export const removeZerofill = (value) => value.toString().replace(/\b0+/g, '');


// takes an object and 
export const toMS = ({ hours, minutes, seconds, h=0, m=0, s=0, ms=0 }) => {
    const hh = hours===undefined ? h : hours;
    const mm = minutes===undefined ? m : minutes;
    const ss = seconds===undefined ? s : seconds;
    return  (HOUR_MS * hh + MINUTE_MS * mm + SECOND_MS * ss) + ms;
}

// Note: Have to use toFixed or toPrecison to bypass the "e" that forms after 16th decimal position
// Example: 1 / 3600000 = 2.7777777777777776e-7
const toInteger = (value) => parseInt( value.toFixed(16) )

// Takes a timestamp and return a unit-based object with short and long form keys
export const fromMS = (timestamp, applyZerofill=false) => {
    let ms = timestamp;

    let hours = toInteger( ms / HOUR_MS ); 

    ms = ms % HOUR_MS;
    
    let minutes = toInteger( ms / MINUTE_MS );
    ms = ms % MINUTE_MS;
    
    let seconds = toInteger( ms / SECOND_MS );
    ms = ms % SECOND_MS;

    if(applyZerofill){
        hours = zerofill(2,hours)
        minutes = zerofill(2,minutes)
        seconds = zerofill(2,seconds)
    }
    
    return { 
        // short form
        h:hours, 
        m:minutes, 
        s:seconds, 
        ms,
        ts:timestamp,
        // long form
        hours, 
        minutes, 
        seconds, 
        milliseconds: ms, 
        timestamp,
        // the input
    }
}


export const createTimeLookup = (activitiesList) => {
    // Get time of where the previous item in the list ended
    const getFrom = (list) => list.length === 0 ? 0 : list.at(-1).to;

    // get time of where last timer ended
    const getTo = () => timers.at(-1).to;

    const timerItem = ({ index, item, totalSiblings }) => {
        const length = toMS(item)
        const from = getFrom(timers);
        const to = from + length;
        const duration = fromMS(length)
        const position = { at:index+1, of: totalSiblings }
        return { index, from, to, length, duration, position }
    }

    const roundItem = ({ index, item, totalSiblings }) => {
        const from = getFrom(rounds);
        const to = getTo();
        const length = to - from;
        const duration = fromMS(length)
        const position = { at:index+1, of: totalSiblings }
        return { index, from, to, length, duration, position }
    }

    const activityItem = ({ index, item, totalSiblings }) => {
        const { id, name } = item;
        const from = getFrom(activities);
        const to = getTo();
        const length = to - from;
        const duration = fromMS(length)
        const position = { at:index+1, of: totalSiblings }
        return { index, id, name, from, to, length, duration, position, }
    }

    const numActivities = activitiesList.length;
    let numRounds = 1;
    let numTimers = 1;
    let activities = [];
    let rounds = [];
    let timers = [];
    activitiesList.forEach((activity, ai) => {
        numRounds = activity.rounds;
        Array(numRounds).fill(0).forEach((round, ri) => {
            numTimers = activity.timers.length;
            activity.timers.forEach((timer, ti) =>{
                timers.push( timerItem({ index:ti, item:timer, totalSiblings:numTimers }) )
            })
            rounds.push( roundItem({ index:ri, totalSiblings:numRounds }) )
        })
        activities.push( activityItem({ index:ai, item:activity, totalSiblings:numActivities })  );

    })
    return { activities, rounds, timers }
}


export const isButton = event => event.target.tagName === 'BUTTON' || event.target.parentNode.tagName === 'BUTTON';


export const hideAllMenus = () => {
    const menus = [ ...document.getElementsByClassName('menu') ];
    menus.map(item=>item.style.display='none');
    window.removeEventListener("click", hideAllMenus)
}

export const toggleMenu = ({ event, menuElement }) => {
    const MARGIN_FROM_EDGE = 8;
    const isOpen = menuElement.style.display === 'block';
    if(isOpen) return;
    setTimeout(()=>{
        menuElement.style.display = 'block';
        const body = document.body.getBoundingClientRect();
        const menu = menuElement.getBoundingClientRect();
        const anchor = event.target.getBoundingClientRect();
        const defaultX = anchor.right - anchor.width;
        const defaultY = anchor.bottom;
        const limitX = body.width - (menu.width + MARGIN_FROM_EDGE);
        const limitY = body.height - (menu.height + MARGIN_FROM_EDGE);
        const alternateY = anchor.top - menu.height;
        const x = defaultX > limitX ? limitX : defaultX;
        const y = defaultY > limitY ? alternateY : defaultY;
        menuElement.style.left = `${ x }px`;
        menuElement.style.top = `${ y }px`;
        window.addEventListener("click", hideAllMenus);
    },1)


}
