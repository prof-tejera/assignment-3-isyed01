import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { decodeRoutine } from "../store/actions/routineActions";
import { updateSession } from "../store/actions/sessionActions";
import { updateHistory } from "../store/actions/historyActions";
import IconButton from "../components/generic/IconButton";
import TimeStatus from "../components/session/TimeStatus";
import TimeControls from "../components/session/TimeControls";
import '../components/session/session.css';

const Session = () => {
    const state = useSelector((state) => state);
    const header = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const routineParam = useParams().routine;

    const handleBack = () => navigate('/')

    useEffect(() => {
        if (state.session.isReady) {
            if (routineParam === state.session.encoded) return;
            const decodedParam = dispatch(decodeRoutine(routineParam));
            if (!decodedParam.match) return navigate(`/${decodedParam.routineParam}`, { replace: true })
            const activities = decodedParam.data.activityQueue;
            dispatch(updateSession({ encoded: routineParam, activities }))
        }
    }, [location, state.session.isReady, dispatch, navigate, routineParam, state.session.encoded])

    useEffect(() => {
        return () => {
            dispatch(updateHistory({
                id: null,
                encoded: routineParam,
                activities: state.routine.activityQueue,
                duration: state.routine.duration,
                accum: state.session.accum
            }))
        }
    }, [dispatch, routineParam, state.routine.activityQueue, state.routine.duration, state.session.accum])

    return <>
        <header ref={header} className='top-app-bar'>
            <div>
                <IconButton icon='arrow_back' onClick={handleBack} />
            </div>
            <div className='top-app-bar-headline display-small session-active-font session-headline'>
                { !state.session.query ? '' : state.session.query.activity.name }
            </div>
            <div>&nbsp;</div>
        </header>
        <main style={{ paddingBottom: 0 }}>
            <div className='container session-container'  >
                {
                    !state.session.query ?
                        <div style={{ alignSelf:'center' }}>
                            <h3 className='diaplay-small'> Nothing to run.</h3>
                            &nbsp;
                            <h1 className='diaplay-large'> ¯\_(ツ)_/¯ </h1>
                        </div> :
                        <>
                            <TimeStatus />
                            <TimeControls />
                        </>
                }
            </div>
        </main>
    </>
}


export default Session;