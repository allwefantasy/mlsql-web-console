import AggStation from "./AggStation";
import Tools from "../../common/Tools";
export const AggStationOp = (superclass) => class extends superclass {
    enableGroupByField = (checked, record) => {
        const fieldName = record.field
        if (checked) {
            this.groupByFields.push(fieldName)
        } else {
            this.groupByFields = this.groupByFields.filter((item) => {
                return item.name !== fieldName
            })
        }
    }
    generateProjectField = (name,newName)=>{
       this.aggFields.push({name,newName})
    }
    onApply = async ()=>{
         this.applyOrSaveRef.enter()
         const tableName = Tools.getTempTableName()
         const newFields = this.aggFields.map(item=>{
             return `${item.name} as ${item.newName}`
         })
         const sql = `select ${newFields.join(",")} from ${this.workshop.getLastApplyTable().tableName} group by ${this.groupByFields.join(",")} as ${tableName};`        
         const status = await this.workshop.apply({tableName,sql})
         this.applyOrSaveRef.exit()
         if(status === 200){
            this.workshop.refreshOperateStation()
         }         
    }
    handleTableInput = (tableName)=>{
       this.tableNameForSave = tableName.target.value
    }
    onSave = async ()=>{               
       const status = await this.workshop.save(this.tableNameForSave)   
       if(status===200){
           this.workshop.refreshOperateStation()
           this.workshop.refreshTableWorkshop()
       }
    }
}