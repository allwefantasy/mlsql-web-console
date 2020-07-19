import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { LimitStationReducer ,LimitStationHandlers} from './actions/LimitStationReducer';


const initState = {
      
}

const LimitStationContext = React.createContext()

function LimitStation() {
    const [state, dispacher] = useReducerAsync(LimitStationReducer, initState, LimitStationHandlers)
    return (
        <LimitStationContext.Provider value={{dispacher}}>
            <div>unimplementd</div>
        </LimitStationContext.Provider>
    )
}
export {LimitStation, LimitStationContext}