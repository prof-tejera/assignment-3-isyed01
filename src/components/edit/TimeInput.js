import { fromMS, toMS, zerofill } from "../../utils/helpers";

const TimeInput = ({ value, onChange = () => { } }) => {

    const parseInputValue = (inputName, inputValue, min, max) => {
        const inputInt = parseInt(inputValue);
        if(isNaN(inputInt)) {
            //console.log(`isNaN(${inputInt})`)
            return fromMS(value)[inputName]
        }
        return inputInt > max ? max : inputInt < min ? min : inputInt
    }

    const handleChange = (event) => {
        const el = event.target;
        const inputName = el.name;
        const updatedValue = parseInputValue(inputName, el.value, parseInt(el.min), parseInt(el.max))
        const timeData = { ...fromMS(value), [inputName]:updatedValue }
        //console.log(timeData)
        const updates = toMS(timeData);
        onChange(updates)

    }
    const handleFocus = (event) => {
        event.target.select();
    }


    const { hours, minutes, seconds } = fromMS(value);
   
    return <div className='field-group'>
        <div className='time-unit'>
            <input type='number' name='hours' value={zerofill(2, hours)} min={0} max={99} placeholder='00' onFocus={handleFocus} onChange={handleChange} />
            <label className='float-bottom'>Hours</label>
        </div>
        <span>:</span>
        <div>
            <input type='number' name='minutes' value={zerofill(2, minutes)} min={0} max={59} placeholder='00' onFocus={handleFocus} onChange={handleChange} />
            <label className='float-bottom'>Minutes</label>
        </div>
        <span>:</span>
        <div>
            <input type='number' name='seconds' value={zerofill(2, seconds)} min={0} max={59} placeholder='00' onFocus={handleFocus} onChange={handleChange} />
            <label className='float-bottom'>Seconds</label>
        </div>
    </div>
}

export default TimeInput;