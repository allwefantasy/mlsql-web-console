import Tools from "../../common/Tools"
export const WorkshopUIOp = (superclass) => class extends superclass {
    updateDisplay = async (data,schema) =>{
        this.setState({tableLoading:true})
        this.displayRef.update(data,schema.fields)
        this.setState({tableLoading:false}) 
    }    

    refreshOperateStation = ()=>{        
        this.stationRef.setState({ key: Math.random() })
    }

    refreshTableWorkshop = ()=>{
        this.leftTreePaneRef.workshopTableTreeRef.reload()
    }
    
}