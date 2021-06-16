import React, { useState, useCallback, useEffect } from 'react';

const useContextMenu = ({contextMenuRef,dispacher,onRender})=>{ 
    
    const [rightClickNodeTreeItem, setRightClickNodeTreeItem] = useState(undefined)    
    
    const onRightClick = useCallback((params) => {        
        const { event, node } = params
        
        let clickX =  event.clientX
        let clickY = event.clientY                                      
        const click = (evt) => {  
            if(!contextMenuRef.current) return
            const wasOutside =  !contextMenuRef.current.contains(evt.target)            
            if (wasOutside) {
                setRightClickNodeTreeItem(undefined)                
            }
        }
        document.addEventListener('click', click);
    
        const scroll = () => {
            setRightClickNodeTreeItem(undefined) 
        }
        document.addEventListener('scroll', scroll);
    
        setRightClickNodeTreeItem({
            pageX: clickX,
            pageY: clickY,
            id: node.id || node.key
        })
        return () => {
            document.removeEventListener('click',click);
            document.removeEventListener('scroll',scroll);
        }
    },[setRightClickNodeTreeItem])

    const ui = useCallback(()=>{
        if (!rightClickNodeTreeItem) {
            return 
        }
        const { pageX, pageY, id } = { ...rightClickNodeTreeItem };    
        const tmpStyle = {
            zIndex: 10000,
            position: "fixed",
            left: `${pageX}px`,
            top: `${pageY}px`,
            borderRadius: "3px",
            boxShadow: "0 0 0 1px rgba(16, 22, 26, 0.1), 0 2px 4px rgba(16, 22, 26, 0.2), 0 8px 24px rgba(16, 22, 26, 0.2)"
        };   
        return <div ref={contextMenuRef} style={tmpStyle}>{onRender({rightClickNodeTreeItem,setRightClickNodeTreeItem,dispacher})}</div>
    },[rightClickNodeTreeItem])
    return {onRightClick,ui}
}

export {useContextMenu}