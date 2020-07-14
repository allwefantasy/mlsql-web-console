import AggStation from "./AggStation";
import Tools from "../../../common/Tools";
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
         this.ApplyOrSaveRef.enter()
         const tableName = Tools.getTempTableName()
         
         let newFields = this.aggFields.map(item=>{
            return `\`${item.name}\` as \`${item.newName}\``
         })

         let groupByFields = ""
         
         if(this.groupByFields.length !==0 ){
            groupByFields = `group by ${this.groupByFields.map(item=>`\`${item}\``).join(",")}`            
            newFields = this.groupByFields.map(item=>`\`${item}\``).concat(newFields)
         }

         const sql = `select ${newFields.join(",")} from ${this.workshop.getLastApplyTable().tableName} ${groupByFields} as ${tableName};`        
         const status = await this.workshop.apply({tableName,sql})
         this.ApplyOrSaveRef.exit()
         if(status === 200){
            this.workshop.refreshOperateStation()
         }         
    }
    
    
}