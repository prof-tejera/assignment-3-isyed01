import { useSelector } from "react-redux";
import DisplayTime from "../shared/DisplayTime";
import RadialProgressbar from "../progress/RadialProgress";
import { ProgressLine, SegmentedProgress } from "../progress/ProgressBars";

const showHours = limit => limit < 3600000

const TimeStatus = () => {
    const state = useSelector((state) => state.session.query);

    return <>
        <ActivityProgress activity={state.activity} round={state.round} />
        <div className='session-radial-timer-wrapper'>
            <RadialTimerDisplay />
        </div>
        <TotalSessionProgress />
    </>
}

const ActivityProgress = ({ activity, round }) => {
    return <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom:'4px' }}>
            <div className='body-medium session-active-font'>
                <RoutineTimeDisplay time={activity.completed} duration={activity.duration} />
            </div>
            <div className='body-medium'>
                <RoutineTimeDisplay time={activity.remaining} duration={activity.duration} />
            </div>
        </div>
        <SegmentedProgress items={round.indexOf} itemIndex={round.index} percent={round.percent} />
    </div>

}

const TimerTimeDisplay = ({ time, duration }) =>
    <DisplayTime time={time} digital={true} hideHours={showHours(duration)} hideLeadingZeros={false} precision={2} />

const RadialTimerDisplay = () => {
    const { timer } = useSelector((state) => state.session.query);
    const { ascending, isRest, duration, completed, remaining, percent } = timer;
    const label = isRest ? 'Resting' : 'Active';
    const displayTime = ascending ? completed : remaining;
    const displayPercent = ascending ? percent : 100 - percent;

    return <>
        <div style={{ width: '100%', maxWidth: '50vh', marginLeft: 'auto', marginRight: 'auto' }}>
            <RadialProgressbar percent={displayPercent} showDot={false}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>{label}</div>
                    <div className='display-small session-active-font session-primary-time' >
                        <TimerTimeDisplay time={displayTime} duration={duration} />
                    </div>
                    <div>
                        / &nbsp;
                        <TimerTimeDisplay time={duration} duration={duration} />
                    </div>
                </div>
            </RadialProgressbar>
        </div>
    </>
}


const RoutineTimeDisplay = ({ time, duration }) =>
    <DisplayTime time={time} digital={true} hideHours={showHours(duration)} hideLeadingZeros={false} precision={0} />


const TotalSessionProgress = () => {
    const state = useSelector((state) => state.session);
    const { routine } = state.query;
    const { duration, completed, remaining, percent } = routine;
    return <>
        <div>
            <div className='session-total-progress-container'>
                <div className='body-small session-active-font'>
                    <RoutineTimeDisplay time={completed} duration={duration} />
                </div>
                <div className='body-small'>
                    <RoutineTimeDisplay time={remaining} duration={duration} />
                </div>
            </div>
            <ProgressLine percent={percent} />
        </div>
    </>

}



export default TimeStatus;