import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addActivity } from "../../store/actions/routineActions";
import { createActivity } from "../../store/actions/activitiesActions";
import ActivityListItem from "./ActivityListItem";
import IconButton from "../generic/IconButton";

const AddActivityDialog = () => {
    const state = useSelector((state) => state);
    return !state.activities.isReady ? '' : <AddActivity  />
}

const AddActivity = () => {
    const state = useSelector((state) => state);
    const [multiselect, setMultiselect] = useState(false);
    const [selections, setSelctions] = useState([]);
    const header = useRef(null)
    const body = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const param = params.routine;

    const handleBack = () => navigate('/')
    const toggleMultiselect = () => {
        setMultiselect(!multiselect)
        setSelctions([])
    }
    const isSelected = id => selections.find(item => item === id) !== undefined;
    const handleSubmit = () => {
        selections.forEach(id => dispatch(addActivity(id)))
        handleBack();
    }
    const handleDeselect = (id) => setSelctions([...selections.filter(item => item !== id)]);
    const handleSelect = (id) => {
        if(multiselect){
            const exists = isSelected(id);
            if (exists) handleDeselect(id);
            else setSelctions([...selections, id]);
        } else {
            dispatch(addActivity(id));
            handleBack();
        }
    }
    const handleCreate = () => {
        const activity = dispatch(createActivity({}));
        navigate(`/${param}/add/${activity.id}`)
    }

    return (
        <div className='dialog-backdrop scrim'>

            <div className='dialog'>
                <header ref={header} className='top-app-bar dialog-header'>
                    <div>
                        <IconButton icon='close' onClick={handleBack}  />
                    </div>
                    <div className='top-app-bar-headline'>Timers</div>
                    <div>
                        { multiselect ? 
                            <IconButton icon='done' onClick={handleSubmit} disabled={selections.length===0} /> 
                        : '' }
                        <IconButton icon='checklist' onClick={toggleMultiselect} />
                        <IconButton icon='more_time' onClick={handleCreate} />
                    </div>
                </header>

                <div ref={body} className='dialog-body' style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div>
                        <ul className='card-list'>
                            {
                                state.activities.list.map((activity, index) =>
                                    <li key={index}>
                                        <ActivityListItem
                                            multiselect={multiselect}
                                            selected={isSelected(activity.id)}
                                            activity={activity}
                                            onSelect={handleSelect}
                                            handleDeselect={handleDeselect}
                                        />
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className='dialog-footer'>&nbsp;</div>
            </div>
        </div>
    )

}



export default AddActivityDialog;