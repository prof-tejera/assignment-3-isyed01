import { fromMS, zerofill } from "../../utils/helpers";

const getDigits = (time) => {
    const { hours, minutes, seconds, ms } = fromMS(time);
    const hh = zerofill(2, hours);
    const mm = zerofill(2, minutes);
    const ss = zerofill(2, seconds);
    const mss = zerofill(3, ms);
    return `${hh}${mm}${ss}${mss}`.split('').map(digit => parseInt(digit));
}

const getData = ({ time = 0, hideLeadingZeros = false }) => {
    const maxHidden = 5;
    const digits = getDigits(time);
    const data = digits.reduce((accum, value, index) => {
        const prev = accum.at(-1);
        const active = prev ? value > 0 || prev.active : value > 0;
        const hidden = prev ? !active && prev.hidden && index < maxHidden && hideLeadingZeros : !active && hideLeadingZeros;
        return [...accum, { value, active, hidden }]
    }, [])
    return { hours: data.splice(0, 2), minutes: data.splice(0, 2), seconds: data.splice(0, 2), ms: data, }
}

const Digit = ({ value = 0, active = true, hidden = false }) => {
    return hidden ? '' : <span className={active ? 'digit-on' : 'digit-off'}>{value}</span>;
}
const TimeUnit = ({ data = [], displayDigits = 2 }) => {
    return data.map((digit, index) => index < displayDigits ? <Digit key={index} {...digit} /> : '')
}
const Colon = ({ active = true, hidden = false }) => {
    return hidden ? '' : <span className={`symbol-colon ${active ? 'symbol-on' : 'symbol-off'}`}>:</span>;
}
const Decimal = ({ active = true, hidden = false }) => {
    return hidden ? '' : <span className={`symbol-decimal ${active ? 'symbol-on' : 'symbol-off'}`}>.</span>;
}
const Label = ({ text = '', active = true, hidden = false, indentRight = true }) => {
    return hidden ? '' :
        <span className={`symbol-char ${indentRight ? 'symbol-indent-right' : ''} ${active ? 'symbol-char-on' : 'symbol-char-off'}`}>
            {text}
        </span>
}

const DisplayTime = ({ time, digital = true, hideHours = false, hideLeadingZeros = true, precision = 3 }) => {
    const { hours, minutes, seconds, ms } = getData({ time, hideLeadingZeros })
    const secondsActive = seconds[1].active || time > 0;
    return <>
        <span className='time-display'>
            {
                hideHours ? '' : <>
                    <TimeUnit data={hours} />
                    { digital ? <Colon {...hours[1]} /> : <Label text='h'  {...hours[1]} /> }
                </>
            }
            <TimeUnit data={minutes} />
            { digital ? <Colon {...minutes[1]} /> : <Label text='m' {...minutes[1]} /> }
            <TimeUnit data={seconds} />
            {
                precision === 0 ? '' :
                    <>
                        <Decimal active={secondsActive} />
                        <small className='digits-ms'>
                            <TimeUnit data={ms} displayDigits={precision} />
                        </small>
                    </>
            }
            {digital ? '' : <Label text='s' active={secondsActive} indentRight={false} />}
        </span>
    </>
}


export default DisplayTime;