import React from "react";
import './ReorderableListItems.css'

const CLASS_SOURCE = 'reorderable-item-drag-source';
const CLASS_OVER_TOP = 'reorderable-target-over-before'
const CLASS_OVER_BOTTOM = 'reorderable-target-over-after'
const NODE_CHECK_LIMIT = 10;

const getSide = (event, element) => {
    const mouseY = event.clientY - element.offsetTop;
    const centerY = element.offsetHeight / 2;
    return mouseY < centerY ? 'top' : 'bottom'
}

const isListItem = (el) => el.tagName.toLowerCase()==='li';

const getListItem = (event) => {
    let el = event.target;
    for(let i = 0; i < NODE_CHECK_LIMIT; i++){
        if(isListItem(el)) return el;
        el = el.parentNode;
    }
}

const ReorderableListItems = ({ items = [], handleUpdate, children }) => {
    let srcEl = null;
    let srcIndex = null;
    let targetEl = null;
    let targetIndex = null;
    let insertSide = null

    const handleDragStart = (event) => {
        srcEl = event.target;
        srcEl.classList.add(CLASS_SOURCE);
        srcIndex = parseInt(event.target.dataset.index)
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', null);
    }

    const handleDragOver = (event) => {
        const prevEl = targetEl;
        targetEl = getListItem(event);
        targetIndex = parseInt(targetEl.dataset.index);
        if (prevEl !== null && prevEl !== targetEl) {
            prevEl.classList.remove(CLASS_OVER_TOP, CLASS_OVER_BOTTOM);
        }
        if (targetEl !== null) {
            targetEl.classList.remove(CLASS_OVER_TOP, CLASS_OVER_BOTTOM);
            insertSide = getSide(event, targetEl);
            if (targetEl !== srcEl) {
                targetEl.classList.add(insertSide==='top'?CLASS_OVER_TOP:CLASS_OVER_BOTTOM) 
            }
        }
    }

    const handleDragEnd = (event) => {
        srcEl.classList.remove("active");
        targetEl.classList.remove(CLASS_OVER_TOP, CLASS_OVER_BOTTOM, "active");
        if (srcEl === targetEl) return;
        let insertAt = insertSide === "top" ? targetIndex - 1 : targetIndex;
        insertAt = insertAt < 0 ? 0 : insertAt;
        let arr = [...items];
        const item = arr.splice(srcIndex, 1)[0];
        arr.splice(insertAt, 0, item)
        handleUpdate(arr)
    }

    const MutatedChild = ({ component, index }) => 
        React.cloneElement( component, {
            'data-index':index,
            draggable:true,
            className:'',
            onDragStart:handleDragStart,
            onDragOver:handleDragOver,
            onDragEnd:handleDragEnd
        })

    return children.map(
        (child, index) => <MutatedChild key={index}  index={index} component={child} /> 
    )
}


export default ReorderableListItems;