import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cloneActivity, deleteActivity } from "../../store/actions/activitiesActions";
import { updateRoutineActivities, encodeRoutine } from "../../store/actions/routineActions";
import { isButton, toggleMenu, hideAllMenus } from "../../utils/helpers";

const ActivityListItem = ({ activity: { id, name, description }, multiselect, selected, onSelect, handleDeselect }) => {
    const menuRef = useRef(null)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const param = params.routine;
    const handleMenuToggle = (event) => toggleMenu({ event, menuElement:menuRef.current })
    const handleSelect = (event) => !isButton(event) ? onSelect(id) : null;
    const handleEdit = () => navigate(`/${param}/add/${id}`)
    const handleClone = () => dispatch(cloneActivity(id))
    const handleDelete = () => {
        hideAllMenus()
        handleDeselect(id);
        dispatch(deleteActivity(id))
        dispatch(updateRoutineActivities())
        const encoded = dispatch(encodeRoutine())
        navigate(`/${encoded}/add`)
    }
    return (
        <>
            <div className='flex-row list-item-surface' onClick={handleSelect}>
                <div style={{ paddingRight: 16 }}>
                    {multiselect ?
                        selected ?
                            <i className="icon material-symbols-outlined checked">check_small</i> :
                            <i className="icon material-symbols-outlined unchecked">check_box_outline_blank</i>
                        : <i className="icon material-symbols-outlined">add</i>
                    }
                </div>
                <div className='flex-grow'>
                    <div className='body-large  hide-x-overflow'>{name}</div>
                    <div className='body-medium  hide-x-overflow'>{description}</div>
                </div>
                {multiselect ? '' : 
                <div style={{ marginRight: '-12px' }}>
                    <button className="icon-button" onClick={handleMenuToggle}>
                        <i className="icon material-symbols-outlined">more_vert</i>
                    </button>
                </div>
                }
            </div>
            <div ref={menuRef} className='menu' >
                <button className='menu-button label-large' onClick={handleEdit}>Edit</button>
                <button className='menu-button label-large' onClick={handleClone}>Clone</button>
                <button className='menu-button label-large' onClick={handleDelete}>Delete</button>
            </div>
        </>
    )
}


export default ActivityListItem;