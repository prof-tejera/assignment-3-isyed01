import styled from "styled-components";


const IntegerInput = styled.input.attrs(
    props => ({
        style: {
            fontSize:       `${ props.fontSize }rem` || '1.5rem',
            height:         `${ props.fontSize * 1.125 }rem` || `1.75rem`,
            width:          `${ (props.fontSize *.65) * props.chars }rem` || `2rem`,
            padding:        `${ props.fontSize * 0.2 }rem` || `0.25rem`,
            margin:         `${ props.fontSize * 0.25 }rem` || `0.35rem`,
            color:          props.fontColor || 'whitesmoke',
            backgroundColor: props.bgColor || 'black',
        },
    }))`
    text-align:center;
    border:none;

    &:focus{
        outline: none;
    }
    
    &:active {
        outline: none;
    }
`


///////////////////////////////////////////////////////////////
//
//  Convert input valuye to a value within range
//
/**
 * @param min Minimum value of range
 * @param hex Maximum value of range
 * @param input The input value
 * @returns number
 */

const toInteger = ({ min=0, max=60, input }) => {
    
    // Remove leading zeroes and convert to a positive number
    input = Math.abs( input.replace(/\D|^0+/g, '') );
    
    // Ensure number is within range
    return  input < min ? min : input > max ? max : input;

}


///////////////////////////////////////////////////////////////
//
//  Main: An input field which only allows whole integers as values
//
//  Notes: 
//  - The HTML5 number field had issues, "e", "-". Required CSS to handle the steps buttons.
//  - Using the time input field had its own headaches to deal with.
//  - EVen the general maxLength input property caused odd behavior when typing
//  - Some significan disconnects across browers, made these issues worse
//
/**
 * @param min Number The minimum amount allowed
 * @param max Number The maximum amount allowed
 * @param value Number The value to map to this field
 * @param onChange Function The onChange handler to fire
 * @param fontSize Number The font size (in rems)
 * @param fontColor String The onChange handler to fire
 * @param onChange String The onChange handler to fire
 * @returns IntegerField component
 */

const IntegerField = ({ min = 0, max = 99, value=0, fontSize=1.5, fontColor='whitesmoke', bgColor='black', onChange=()=>{} }) => {
    
    const handleChange = e => onChange( toInteger({ min, max, input: e.target.value }) )

    return <IntegerInput
        type="integer"
        value={value || min}
        onFocus={e => e.target.select()}
        onChange={handleChange}
        chars={`${max}`.length}
        fontSize={fontSize}
        fontColor={fontColor}
        bgColor={bgColor}
        
    />
}

export default IntegerField;