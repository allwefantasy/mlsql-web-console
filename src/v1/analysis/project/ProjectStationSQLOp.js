import Tools from "../../../common/Tools";
export const ProjectStationSQLOp = superclass => class extends(superclass) {
    onSelectApply = async ()=>{
        this.ApplyOrSaveRef.enter()
        const fields = this.selectFieldsRef.getSelectFields().map(item=>{
            return `\`${item}\``
        })
        if(fields.length === 0){
            this.workshop.showInfo("No fields are selected.")
            this.ApplyOrSaveRef.exit()
            return
        }
        const tableName = Tools.getTempTableName()
        
        const sql = `select ${fields.join(",")} from ${this.workshop.getLastApplyTable().tableName} as ${tableName};`
        await this.workshop.apply({tableName,sql})
        this.ApplyOrSaveRef.exit()
        this.workshop.refreshOperateStation()
     }
 
     onFuncApply = async ()=>{
         this.ApplyOrSaveRef.enter()
         const fields = this.functionFieldRef.getSelectFields()        
         if(fields.length === 0){
             this.workshop.toggleMessage("No fields are renamed.")
             this.ApplyOrSaveRef.exit()
             return
         }

         const isAggExists = fields.filter(item=>item.isAgg).length > 0
         let newFields = []
         
         if(!isAggExists){
            newFields = fields.map(item=>{                        
                if(item["transformCode"]){
                    return `${item["transformCode"]} as \`${item["columnName"]}\``
                } else return `\`${item["field"]}\` as \`${item["field"]}\``
                
            }) 
         }else {
            newFields = fields.filter(item=>item.isAgg).map(item=>`${item["transformCode"]} as \`${item["columnName"]}\``)
         }
         
         
         
         const tableName = Tools.getTempTableName()  
         const sql = `select ${newFields.join(",")} from ${this.workshop.getLastApplyTable().tableName} as ${tableName};`        
         await this.workshop.apply({tableName,sql})
         this.ApplyOrSaveRef.exit()
         this.workshop.refreshOperateStation()
      }
 
      onRenameApply = async ()=>{
         this.ApplyOrSaveRef.enter()
         const fields = this.renameFieldsRef.getSelectFields()    
         const currentFields = this.workshop.currentTable.schema.fields.map(item=>`\`${item.name}\``)
         
         if(fields.length === 0){
             this.workshop.toggleMessage("No fields are renamed.")
             this.ApplyOrSaveRef.exit()
             return
         }
         const newFields = Object.keys(fields).map(item=>{
             return `\`${item}\` as \`${fields[item]}\``
         })
         
        //  const tempC = Object.keys(fields)
         //const leftFieds = currentFields.filter(item=> !tempC.includes(item))
         const tableName = Tools.getTempTableName()  
         const sql = `select ${currentFields.concat(newFields).join(",")} from ${this.workshop.getLastApplyTable().tableName} as ${tableName};`        
         await this.workshop.apply({tableName,sql})
         this.ApplyOrSaveRef.exit()
         this.workshop.refreshOperateStation()
 
 
      }
}