import './ProgressBars.css'

export const ProgressLine = ({ percent }) =>
<div className='progress-line'>
    <div className='fill' style={{ width:`${percent}%` }}></div>
</div>
    

export const IndentedProgress = ({ indent, width }) =>
<div className='indented-progress'>
    <div className='fill' style={{ marginLeft: `${indent}%`, width: `${width}%`}} ></div>
</div>


export const SegmentedProgress = ({ items, itemIndex, percent }) =>
    <div className='segmented-progress'>
        {Array(items + 1).fill(0).map((item, index) => (
           <Segment key={index} percent={index < itemIndex ? 100 : index > itemIndex ? 0 : percent} />
        ))}
    </div>

const Segment = ({ percent }) => {
    return <div className='segment'>
        <div className='fill' style={{ width: `${percent}%` }}></div>
    </div>
}
