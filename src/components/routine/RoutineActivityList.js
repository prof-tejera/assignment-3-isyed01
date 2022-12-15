import { useDispatch, useSelector } from "react-redux";
import { reorderQueueu } from "../../store/actions/routineActions";
import ReorderableListItems from "../generic/ReorderableListItems";
import ActivityQueueCard from "./ActivityQueueCard";


const RoutineActivityList = () => {
    const activities = useSelector((state) => state.routine.activityQueue);
    const dispatch = useDispatch();
    const handleReorder = (activities) => dispatch(reorderQueueu(activities))
    return activities.length === 0 ?
        <h1 className='diaplay-large'>
            No activities added.
        </h1> 
        : 
        <div className=''>
            <ul className='reorderable no-border card-list-gap-8'>
                <ReorderableListItems items={activities} handleUpdate={handleReorder}>
                    {
                        activities.map((activity, index) =>
                            <li key={index} >
                                <ActivityQueueCard index={index} activity={activity} />
                            </li>
                        )
                    }
                </ReorderableListItems>
            </ul>
        </div>
}

export default RoutineActivityList;

