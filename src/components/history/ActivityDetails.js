import DisplayTime from "../shared/DisplayTime";

const Time = ({ time }) => <DisplayTime time={time} digital={false} hideHours={time < 3600000} hideLeadingZeros={true} precision={0} />
const ActivityDetails = ({ activities }) => {
    return <>
        {
            activities.map((activity, index) =>
                <div key={index} className='surface-5 history-activity-card'>
                    {activity.name}
                    <br/>
                    <span>
                        <Time time={activity.activeTime} /> x {activity.rounds} = 
                        <Time time={activity.rounds * activity.activeTime} />
                    </span>
                </div>
            )
        }
    </>
}



export default ActivityDetails;