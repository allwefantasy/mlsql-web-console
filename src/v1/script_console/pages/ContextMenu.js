import React, { useRef, useCallback, useEffect } from 'react';

const useContextMenuCallback = (contextMenuRef,dispacher,marker)=>{    
    return useCallback((params) => {
        const { event, node } = params
        let clickX =  event.clientX
        let clickY = event.clientY - 60
        if(marker){
            function iter(tree,visit){
                visit(tree)
                const children = [].slice.call(tree.children)
                children.map(item=>{
                    iter(item,visit)
                 })
                
            }
            let target = undefined
            iter(event.target,(item)=>{
                if(item.className===marker && !target){                
                   target = item
                }
            })
            if(!target){
                target = event.target
            }
            const clientRec = target.getBoundingClientRect()
            clickX = clientRec.left + clientRec.width - 20 //event.target.offsetLeft + event.target.style.width // event.clientX  // + document.documentElement.scrollLeft + document.body.scrollLeft
            clickY = clientRec.top - clientRec.height 
        }                       
    
        const click = (evt) => {  
            if(!contextMenuRef.current) return
            const wasOutside =  !contextMenuRef.current.contains(evt.target)            
            if (wasOutside) {
                dispacher({
                    type: "setState",
                    data: { rightClickNodeTreeItem: undefined }
                })
            }
        }
        document.addEventListener('click', click);
    
        const scroll = () => {
            dispacher({
                type: "setState",
                data: { rightClickNodeTreeItem: undefined }
            })
        }
        document.addEventListener('scroll', scroll);
    
        const data = {
            rightClickNodeTreeItem: {
                pageX: clickX,
                pageY: clickY,
                id: node.id
            }
        }
        dispacher({
            type: "setState",
            data
        })
        return () => {
            document.removeEventListener('click',click);
            document.removeEventListener('scroll',scroll);
        }
    }, [])
}

export {useContextMenuCallback}