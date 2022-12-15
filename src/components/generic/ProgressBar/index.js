import './index.css';

const CSS_DEFAULT_CLASS_NAME = '';
const CSS_ACTIVE_CLASS_NAME = 'active-bg';
const CSS_COMPLETE_CLASS_NAME = 'active-bg-dark';


export const ProgressBar = ({ percent }) => <>
    <div className='progress linear'>
        <div className={CSS_ACTIVE_CLASS_NAME} style={{ width: `${percent}%` }}></div>
    </div>
</>

export const ProgressLine = ({ percent }) => <>
    <div className='progress line'>
        <div className={CSS_ACTIVE_CLASS_NAME} style={{ width: `${percent}%` }}></div>
    </div>
</>


const Segment = ({ count, index, total }) => {
    return <div className={ 
        count===index ? 
            CSS_ACTIVE_CLASS_NAME : 
            count<index ? 
                CSS_COMPLETE_CLASS_NAME : 
                CSS_DEFAULT_CLASS_NAME 
    } />
}

export const SegmentedProgressBar = ({ index, total }) => {
    return <div className='progress segmented'>
        {
            Array(total).fill(0).map((item, key)=>
                <Segment key={key} count={key} index={index} total={total} />
            )
            
        }
        
    </div>
}




export default ProgressBar;