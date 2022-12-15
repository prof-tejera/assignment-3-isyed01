
const IconButton = ({ icon='error', onClick=()=>{}, caption='', disabled=false, fab=false }) => {
    return <button className={`icon-button ${fab?'fab':''}`} onClick={onClick} title={caption} disabled={disabled}>
    <i className="icon material-symbols-outlined">{icon}</i>
</button>
}

export default IconButton;