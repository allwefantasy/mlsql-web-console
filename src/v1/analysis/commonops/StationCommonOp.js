export const StationCommonOp = (superclass) => class extends superclass {
    onSave = async ()=>{               
        const status = await this.workshop.save(this.tableNameForSave)   
        if(status===200){
            this.workshop.refreshOperateStation()
            this.workshop.refreshTableWorkshop()
        }
     }
     handleTableInput = (tableName)=>{         
        this.tableNameForSave = tableName.target.value
     }
}