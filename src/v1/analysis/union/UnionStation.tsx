import * as React from 'react'
import { useReducerAsync } from 'use-reducer-async'
import { UnionStationReducer, UnionStationHandlers } from './actions/UnionStationReducer'
import {SelectUnionTable} from './SelectUnionTable'

interface Props {   
}

const initState = {}

const UnionStationContext = React.createContext<{state:any,dispacher:React.Dispatch<any>}|null>(null)

const UnionStation:React.FunctionComponent<Props> = (props) => {
    const [state, dispacher] = useReducerAsync(UnionStationReducer, initState, UnionStationHandlers)
    return (
        <UnionStationContext.Provider value={ { state,dispacher} }>
          <SelectUnionTable/>
      </UnionStationContext.Provider>
    )
}

export { UnionStation, UnionStationContext}