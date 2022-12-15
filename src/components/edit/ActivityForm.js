import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateActivity } from "../../store/actions/activitiesActions";
import { updateRoutineActivities } from "../../store/actions/routineActions";
import ActivityFormToolbar from "./ActivityFormToolbar";
import TimeInput from "./TimeInput";

const ActivityForm = () => {
    const state = useSelector((state) => state);
    const [form, setForm] = useState({ dirty: false, name: '', description: '', ascending: true, rounds: 0, activeTime: 0, restTime: 0 });
    const body = useRef(null)
    const dispatch = useDispatch();
    const params = useParams();
    const activityIndexParam = params.activityIndex;

    const from = activityIndexParam!==undefined ? 'routine' : 'add';
    const indexId = from==='routine' ? state.routine.queue[parseInt(activityIndexParam)] : null;
    const activityIdParam = from==='routine' ? indexId : parseInt(params.activityId);
   
    const update = (update) => {
        const prop = Object.keys(update)[0];
        const value = update[prop];
        setForm({ ...form, dirty: true, [prop]: value })
    }
    const handleName = (event) => update({ name: event.target.value });
    const handleDescription = (event) => update({ description: event.target.value });
    const handleAscending = (event) => update({ ascending: parseInt(event.target.value) });
    const handleRounds = (event) => update({ rounds: isNaN(parseInt(event.target.value)) ? 0 : parseInt(event.target.value) }); // handle isNaN
    const handleActiveTime = (activeTime) => update({ activeTime });
    const handleRestTime = (restTime) => update({ restTime });
    const handleRoundsBlur = (event) => {
        const value = parseInt(event.target.value);
        const rounds = isNaN(value) || value < 1 ? 1 : value > 100 ? 100 : value;
        update({ rounds });
    }
    const activity = state.activities.list.find(item => item.id === activityIdParam)
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(updateActivity({ ...activity, ...form }))
        setForm({ ...form, dirty: false })
        dispatch(updateRoutineActivities());
    }

    useEffect(()=>{
        if(activity){
            const { name, description, ascending, rounds, activeTime, restTime } = activity;
            setForm({ dirty: false, name, description, ascending, rounds, activeTime, restTime });
        }
    },[activity])

    return !activity ? '' : (
        <div className='dialog-backdrop scrim'>
            <div className='dialog'>

                <ActivityFormToolbar name={form.name} dirty={form.dirty} submitHandler={handleSubmit}  />

                <div ref={body} className='dialog-body'>
                    <form className='form' onSubmit={handleSubmit}>
                        <fieldset>
                            <div className='field'>
                                <input id='name-input' name='name' type='text' placeholder='Enter a name' value={form.name} onChange={handleName} required={true} minLength={2} maxLength={24} />
                                <label className='float' htmlFor='name-input'>Name*</label>
                                <div className='counter'>{form.name.length}/24</div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='field'>
                                <input id='name-desc' name='description' type='text' placeholder='Enter a description' value={form.description} onChange={handleDescription} required={false} minLength={0} maxLength={32} />
                                <label className='float' htmlFor='name-desc'>Description</label>
                                <div className='counter'>{form.description.length}/32</div>

                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='field'>
                                <TimeInput name='activeTime' required={true} value={form.activeTime} onChange={(value)=>handleActiveTime(value)} />
                                <label className='float' htmlFor='active-time'>Activity Time*</label>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='field'>
                                <TimeInput name='restTime' required={true} value={form.restTime} onChange={(value)=>handleRestTime(value)} />
                                <label className='float' htmlFor='rest-time'>Rest Period</label>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='field'>
                                <div className='field-group-slider'>
                                    <div>
                                        <input id='rounds' name='rounds' type='number' value={form.rounds} onChange={handleRounds} onBlur={handleRoundsBlur} required={false} min={1} max={100} />
                                        <label className='float' htmlFor='rounds'>Rounds</label>
                                    </div>
                                    <div className='slider-wrap'>
                                        <input type="range" name='rounds' value={form.rounds} min={1} max={100} step={1} onChange={handleRounds} />
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <fieldset>
                            <div className='field'>
                                <div className='field-group toggle'>
                                    <div>
                                        <input type="radio" id='asc' name='ascending' value={1} checked={form.ascending} onChange={(handleAscending)} />
                                        <label htmlFor='asc' className='label-large'>Count up</label>
                                    </div>
                                    <div>
                                        <input type="radio" id='desc' name='ascending' value={0} checked={!form.ascending} onChange={handleAscending} />
                                        <label htmlFor='desc' className='label-large'>Count down</label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div className='dialog-footer'>
                    &nbsp;
                </div>
            </div>
        </div>
    )
}



export default ActivityForm;