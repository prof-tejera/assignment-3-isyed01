import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isButton } from "../../utils/helpers";
import { removeHistory } from "../../store/actions/historyActions";
import DisplayTime from "../shared/DisplayTime";
import { ProgressLine } from "../progress/ProgressBars";
import ActivityDetails from "./ActivityDetails";

const HistoryCard = ({ id, encoded, timestamp, activities, duration, accum }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const percentStr = ((accum / duration) * 100).toFixed(2)
    const percent = parseInt(percentStr);
    const handleRemove = () => dispatch(removeHistory(id))
    const handleOpen = (event) => {
        if(!isButton(event))
            navigate(`/${encoded}`)
    }
    return <>
        <div className='card' onClick={handleOpen} style={{ cursor: 'pointer' }}>
            <div className='flex-row'>
                <div className='flex-row flex-grow' style={{ flex: 1  }}>
                    <div className='flex-grow'>
                        <div className='title-medium hide-x-overflow'>{new Date(timestamp).toLocaleString('en-US')}</div>
                    </div>
                    <div className='title-medium'>
                        <span style={{ color: 'var(--md-sys-comp-checkbox-selected-color)' }}>
                        <DisplayTime time={accum} digital={false} hideHours={duration < 3600000} hideLeadingZeros={true} precision={0} /> 
                        </span>
                        <span style={{ opacity:'0.35' }}>
                        &nbsp;/&nbsp; 
                        </span>
                        <DisplayTime time={duration} digital={false} hideHours={duration < 3600000} hideLeadingZeros={true} precision={0} />
                    </div>
                </div>
                <div>
                    <button className="icon-button" onClick={handleRemove} title='Remove from list'>
                        <i className="icon material-symbols-outlined">remove</i>
                    </button>
                </div>
            </div>
            <div className='body-medium'>
                <ActivityDetails activities={activities} />
            </div>
            <ProgressLine percent={percent} />
        </div>
    </>
}



export default HistoryCard;