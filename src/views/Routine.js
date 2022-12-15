import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { decodeRoutine, encodeRoutine } from "../store/actions/routineActions";
import { updateHistory } from "../store/actions/historyActions";
import DisplayTime from "../components/shared/DisplayTime";
import IconButton from "../components/generic/IconButton";
import RoutineActivityList from "../components/routine/RoutineActivityList";
import '../components/routine/routine.css'

const Routine = () => {
    const state = useSelector((state) => state);
    const header = useRef(null)
    const body = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const routineParam = useParams().routine;
    const handleStartSession = () => {
        dispatch(updateHistory({ 
            encoded:routineParam, 
            activities:state.routine.activityQueue, 
            duration:state.routine.duration, 
            accum:0 
        }))
        navigate(`/${routineParam}/session`);
    }
    const handleAdd = () => navigate(`/${routineParam}/add`)
    const handleHistory = () => navigate(`/history`)
    useEffect(() => {
        const decodedParam = dispatch(decodeRoutine(routineParam));
        if (!decodedParam.match) {
            navigate(`/${decodedParam.param}`, { replace: true })
        }
    }, [location, dispatch, navigate, routineParam])
    useEffect(() => {
        const encodeRoutined = dispatch(encodeRoutine());
        if (routineParam !== encodeRoutined) {
            navigate(`/${encodeRoutined}`, { replace: true })
        }
    }, [state.routine, dispatch, navigate, routineParam])

    useEffect(() => {
        const headerEl = header.current;
        const bodyEl = body.current;
        const scrollHandler = () => bodyEl.scrollTop > 1 ?
             headerEl.classList.add("is-scrolling") : 
             headerEl.classList.remove("is-scrolling");
        bodyEl.addEventListener("scroll", scrollHandler);
        return () => bodyEl.removeEventListener("scroll", scrollHandler);
    }, []);

    return <>
        <header ref={header} className='top-app-bar'>
            <div>
            <IconButton icon='history' onClick={handleHistory} />
            </div>
            <div className='top-app-bar-headline'>
                {state.routine.queue.length} Activities
            </div>
            <div >
                <div className='title-large routine-header-time'>
                    <DisplayTime time={state.routine.duration} digital={true} hideHours={state.routine.duration < 3600000} hideLeadingZeros={false} precision={0} />
                </div>
                <IconButton icon='timer' onClick={handleStartSession} />
            </div>
        </header>

        <main ref={body}>
            <div className='container'>
                <RoutineActivityList />
            </div>
        </main>
        <div className='container routine-fab-container' >
            <IconButton icon='add' fab={true} onClick={handleAdd} />
        </div>
    </>
}




export default Routine;

