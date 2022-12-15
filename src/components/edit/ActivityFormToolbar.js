import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cloneActivity, deleteActivity } from "../../store/actions/activitiesActions";
import { addActivity, removeActivity, updateRoutineActivities } from "../../store/actions/routineActions";
import IconButton from "../generic/IconButton";

const ActivityFormToolbar = ({ name, dirty, submitHandler }) => {
    const state = useSelector((state) => state);
    const header = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const routineParam = params.routine;
    const activityIndexParam = params.activityIndex;
    // determine contextual route and updates
    const from = activityIndexParam !== undefined ? 'routine' : 'add';
    const indexId = from === 'routine' ? state.routine.queue[parseInt(activityIndexParam)] : null;
    const activityIdParam = from === 'routine' ? indexId : parseInt(params.activityId);
    const activityIndex = from === 'routine' ? parseInt(params.activityIndex) : null;

    const handleBack = () => {
        if (from === 'routine') {
            return navigate(`/`)
        }
        navigate(`/${routineParam}/add`)
    }
    /* Remove from Routine */
    const handleRemove = () => {
        dispatch(removeActivity(activityIndex))
        handleBack()
    }
    /* Add to Routine */
    const handleAdd = () => {
        dispatch(addActivity(activityIdParam))
        navigate('/')
    }
    /* Delete from everywhere */
    const handleDelete = () => {
        dispatch(deleteActivity(activityIdParam))
        dispatch(updateRoutineActivities())
        handleBack()
    }
    /* Clone */
    const handleCopy = () => {
        const activity = dispatch(cloneActivity(activityIdParam))
        navigate(`/${routineParam}/add/${activity.id}`)
    }
    const handleSubmit = (event) => submitHandler(event);

    return <header ref={header} className='top-app-bar dialog-header'>
        <div>
            <IconButton icon={from === 'routine' ? 'close' : 'arrow_back'} onClick={handleBack} />
        </div>
        <div className='top-app-bar-headline' style={{ alignSelf: 'center' }}>
            <div className='hide-x-overflow'>{name}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <button className="icon-button" onClick={handleSubmit} disabled={!dirty} title='Save changes'>
                <i className="icon material-symbols-outlined">done</i>
            </button>
            {from === 'routine' ?
                <>
                    <IconButton icon='add' onClick={handleAdd} caption='Add another' />
                    <IconButton icon='remove' onClick={handleRemove} caption='Remove' />
                </>
                :
                <>
                    <IconButton icon='content_copy' onClick={handleCopy} caption='Create a duplicate' />
                    <IconButton icon='delete' onClick={handleDelete} caption='Delete permanently' />
                </>
            }
        </div>
    </header>
}


export default ActivityFormToolbar;