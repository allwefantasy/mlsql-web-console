export const StationCommonOp = (superclass) => class extends superclass {
    onSave = async ()=>{               
        const status = await this.workshop.save(this.tableNameForSave,this.persistForSave)   
        if(status===200){
            this.workshop.refreshOperateStation()
            this.workshop.refreshTableWorkshop()
        }
     }

     onRollback = async ()=>{         
      this.ApplyOrSaveRef.enter()              
      const status = await this.workshop.rollback()   
      if(status===200){
          this.workshop.refreshOperateStation()
          this.workshop.refreshTableWorkshop()
      }
      this.ApplyOrSaveRef.exit()
    }

     handleTableInput = (tableName)=>{         
        this.tableNameForSave = tableName.target.value
     }
     handlePersit=(checked)=>{
        this.persistForSave = checked
     }

     
}