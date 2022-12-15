
//////////////////////////////////////////
// Build the virtual tree structure

const createTimerHneierarchy = ({ timers }) => {
    const willRest = timers[1] > 0;
    return timers.reduce((accum, timer, index) => {
        if (timer > 0) {
            accum.push({
                index,
                indexOf: timers[1] > 0 ? 1 : 0,
                isRest: index === 1,
                willRest,
                duration: timer,
            });
        }
        return accum;
    }, [])
}

const createRoundHneierarchy = ({ rounds, timers }) =>
    Array(rounds).fill(0).map((round, index) => ({
        index,
        indexOf: rounds - 1,
        timers: createTimerHneierarchy({ timers })
    }))

const createActivityHneierarchy = ({ activities }) =>
    activities.map((activity, index) => ({
        ...activity,
        index,
        indexOf: activities.length - 1,
        rounds: createRoundHneierarchy({
            rounds: activity.rounds,
            timers: [activity.activeTime, activity.restTime]
        })
    }))

export const createTimeline = (activityQueue) => {
    let activityFrom = 0;
    let roundFrom = 0;
    let timerFrom = 0;
    let to = 0;
    const tree = createActivityHneierarchy({ activities: activityQueue })
    const activities = tree.map((activity) => {
        activityFrom = to;
        const rounds = activity.rounds.map((round) => {
            roundFrom = to;
            const timers = round.timers.map((timer) => {
                timerFrom = to;
                to = to + timer.duration;
                return { ...timer, from: timerFrom, to }
            })
            return { ...round, from: roundFrom, to, duration: to - roundFrom, timers }
        })
        return { ...activity, from: activityFrom, to, duration: to - activityFrom, rounds }
    })
    return { from: 0, to, duration: to, activities }
}


///////////////////////////////////////////
//
//  load up the time stamps everywhere
//  const formatPercent = (num) => (num * 100).toFixed(2) 

const formatPercent = (num) => num * 100

const getContextualTime = ({ from, to, accum }) => {
    const duration = to - from;
    const remaining = to - accum;
    const completed = duration - remaining;
    const percent = formatPercent(accum > 0 ? completed / duration : 0);
    return { duration, completed, remaining, percent }
}

const timerQueryResult = ({ timer, ascending, accum }) => {
    const { index, indexOf, from, to, isRest, willRest } = timer;
    const { duration, completed, remaining, percent } = getContextualTime({ from, to, accum });
    return { index, indexOf, from, to, duration, completed, remaining, percent, ascending, isRest, willRest, }
}

const roundQueryResult = ({ round, accum }) => {
    const { index, indexOf, from, to } = round;
    const { duration, completed, remaining, percent } = getContextualTime({ from, to, accum });
    return { index, indexOf, from, to, duration, completed, remaining, percent }
}

const activityQueryResult = ({ activity, accum }) => {
    const { name, id, index, indexOf, from, to, } = activity;
    const { duration, completed, remaining, percent } = getContextualTime({ from, to, accum });
    return { name, id, index, indexOf, from, to, duration, completed, remaining, percent }
}

const routineQueryResult = ({ routine, accum }) => {
    const { name, id, from, to } = routine;
    const { duration, completed, remaining, percent } = getContextualTime({ from, to, accum });
    return { id, name, from, to, duration, completed, remaining, percent }
}

const queryFirstInRange = (array, accum) =>
    array.filter(item => accum >= item.from && accum <= item.to).at(-1)


// export: queryTimeline

export const queryTimeline = ({ timeline, accum = 0 }) => {
    if (timeline.activities.length === 0) return null;

    const activity = queryFirstInRange(timeline.activities, accum)
    const round = queryFirstInRange(activity.rounds, accum)
    const timer = queryFirstInRange(round.timers, accum)
    const { ascending } = activity;
    // massage the data

    const accumInt = parseInt(accum)

    return {
        routine: routineQueryResult({ routine: timeline, accum: accumInt }),
        activity: activityQueryResult({ activity, accum: accumInt }),
        round: roundQueryResult({ round, accum: accumInt }),
        timer: timerQueryResult({ timer, ascending, accum: accumInt }),
    }
}


///////////////////////////////////////////
// Export

const Timeline = {
    createTimeline,
    queryTimeline,
}

export default Timeline