import React,{useEffect} from 'react'
import { useReducerAsync } from 'use-reducer-async'
import { UnionStationReducer, UnionStationHandlers, UnionStationActionNames } from './actions/UnionStationReducer'
import {useSelectUnionTable} from './SelectUnionTable'
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback'
import AnalysisWorkshop from '../workshop'
import { CommonActionNames } from '../common/CommonActionNames'
import { UnionApplyValues } from './actions/UnionApplyAction'

interface Props {   
}

const initState = {
  applySaveRollbackDispacher: undefined,
  error:undefined
}

const UnionStationContext = React.createContext<{state:any,dispacher:React.Dispatch<any>}|null>(null)

const UnionStation:React.FunctionComponent<Props> = (props) => {
    const [state, dispacher] = useReducerAsync(UnionStationReducer, initState, UnionStationHandlers)
    const {applySaveRollbackDispacher,error} = state

    const {ui:SelectUnionTable, form:unionTableForm} = useSelectUnionTable()

    useEffect(() => {
      if (applySaveRollbackDispacher) {
      
        const {unionTable,duplicate} = unionTableForm.getFieldsValue()

        dispacher({
          type:CommonActionNames.setState,
          data: {error:undefined}
        })

        const values:UnionApplyValues = {unionTable,duplicate: duplicate as boolean}        
  
        dispacher({
          type: UnionStationActionNames.UnionApply,
          data: {
            workshop:AnalysisWorkshop.workshop,
            values
          }
        })
      }
    }, [applySaveRollbackDispacher])

    return (
        <UnionStationContext.Provider value={ { state,dispacher} }>
          <div style={{marginBottom:"30px"}}><ApplySaveRollback context={UnionStationContext} workshop={AnalysisWorkshop.workshop} /></div>
          <SelectUnionTable/>
      </UnionStationContext.Provider>
    )
}

export { UnionStation, UnionStationContext}