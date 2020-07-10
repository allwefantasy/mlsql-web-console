import Tools from "../../common/Tools"
import EditorOp from "../comp_op/EditorOp"
export const WorkshopUIOp = (superclass) => class extends superclass {
    updateDisplay = async (data) =>{
        this.setState({tableLoading:true})
        this.displayRef.update(data)
        this.setState({tableLoading:false}) 
    }

    showMessage = (msg)=>{
        new EditorOp(this.messageConsoleRef).setText(msg)
    }

    refreshOperateStation = ()=>{        
        this.stationRef.setState({ key: Math.random() })
    }

    refreshTableWorkshop = ()=>{
        this.leftTreePaneRef.workshopTableTreeRef.reload()
    }
    
}