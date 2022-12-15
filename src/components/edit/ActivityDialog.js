import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ActivityForm from "./ActivityForm";

/*
Params: 
    @activityIndex = editing an instance from routine
    @activityId = editing within list, with no context
*/

const ActivityDialog = () => {
    const state = useSelector((state) => state);
    const params = useParams();
    const activityIdParam = params.activityId;
    const activityIndexParam = params.activityIndex;
    const noParams = !activityIdParam && !activityIndexParam;
    return !state.activities.isReady || noParams ? '' : <ActivityForm  />
}

export default ActivityDialog;