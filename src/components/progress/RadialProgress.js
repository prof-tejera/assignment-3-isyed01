import './RadialProgress.css'

const RadialProgressbar = ({ percent = 0, showDot=true, children }) =>
    <div className='radial-progress' >
        { 
            showDot ? 
            <div className='dot' style={{ transform: `rotate(calc(3.6deg * ${percent} ))` }}></div>
            : ''
        }
        
        <svg viewBox="0 0 150 150">
            <circle cx='70' cy='70' r='70' />
            <circle cx='70' cy='70' r='70' style={{ strokeDashoffset: (440 - (440 * percent) / 100) }} />
        </svg>
        <div className='content'>
            {children}
        </div>
    </div>


export default RadialProgressbar;