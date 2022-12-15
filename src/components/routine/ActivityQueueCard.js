import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { removeActivity } from "../../store/actions/routineActions";
import { isButton } from "../../utils/helpers";
import DisplayTime from "../shared/DisplayTime";
import IconButton from "../generic/IconButton";
import { IndentedProgress } from "../progress/ProgressBars";

const ActivityQueueCard = ({ index, activity: { id, name, description, duration } }) => {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const routineParam = params.routine;
    const { activityQueue } = state.routine;
    const startPoint = activityQueue.reduce((accum, item, i) => i >= index ? accum : accum + item.duration, 0)
    const progMargin = (startPoint / state.routine.duration) * 100;
    const progSize = (duration / state.routine.duration) * 100;
    const handleOpen = (event) => {
        if (!isButton(event))
            navigate(`/${routineParam}/${index}`)
    }
    const handleRemove = () => {
        dispatch(removeActivity(index))
    }
    return (
        <div className='card draggable' onClick={handleOpen} style={{ cursor: 'pointer' }}>
            <div className='flex-row'>
                <div className='flex-row flex-grow' style={{ flex: 1 }}>
                    <div className='flex-grow'>
                        <div className='title-medium  hide-x-overflow'>{name}</div>
                        <div className='body-medium  hide-x-overflow'>{description === '' ? 'N/A' : description}</div>
                    </div>
                    <div className='title-large'>
                        <DisplayTime time={duration} digital={true} hideHours={state.routine.duration < 3600000} hideLeadingZeros={false} precision={0} />
                    </div>
                </div>
                <div>
                    <IconButton icon='remove' onClick={handleRemove} />
                </div>
            </div>
            <IndentedProgress indent={progMargin} width={progSize} />
        </div>
    )
}


export default ActivityQueueCard;

