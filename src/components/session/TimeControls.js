import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startSession, stopSession, resetSession, endSession, goPrev, goNext } from "../../store/actions/sessionActions";
import IconButton from "../generic/IconButton";

const TimeControls = () => {
    const state = useSelector((state) => state.session);
    const dispatch = useDispatch();
    const handlePlay = () => {
        if (state.isPaused) {
            if (!state.isCompleted)
                dispatch(startSession())
        } else {
            dispatch(stopSession())
        }
    }
    const handleReset = () => dispatch(resetSession())
    const handleEnd = () => dispatch(endSession())
    const handlePrev = () => dispatch(goPrev())
    const handleNext = () => dispatch(goNext())

    useEffect(() => {
        return () => {
            dispatch(stopSession())
        }
    }, [dispatch])
    return <>
        <div className='session-time-controls-container'>
            <IconButton icon='first_page' onClick={handleReset} disabled={state.accum === 0 && !state.isCompleted} />
            <IconButton icon='keyboard_arrow_left' onClick={handlePrev} disabled={state.accum === 0 && !state.isCompleted} />
            <IconButton icon={state.isPaused ? 'play_arrow' : 'pause'} fab={true} onClick={handlePlay} disabled={state.accum === state.duration} />
            <IconButton icon='keyboard_arrow_right' onClick={handleNext} disabled={state.accum === state.duratio} />
            <IconButton icon='last_page' onClick={handleEnd} disabled={state.accum === state.duratio} />
        </div>
    </>
}


export default TimeControls;