export const NewSessionOp = superclass=> class extends(superclass){
    toggleNewSession = ()=>{
        this.setState({showNewSession:!this.state.showNewSession})
      }
      showNewSession = (evt)=>{
        if(!evt.node.props['table']){
          return
        }
        const currentTable = {table: evt.node.props['table'],db: evt.node.props['db']}
        this.setState({showNewSession:true,currentTable})
      }
    
      currentTableName = ()=>{
          if(!this.state.currentTable){
              return ""
          }
        return this.state.currentTable.db + "." + this.state.currentTable.table
      }
    
      showTable = async (prefix)=>{
          this.setState({showNewSession:false})        
          const {db,table} = this.state.currentTable
          this.workshop.newSession(prefix,db,table)        
      }
}