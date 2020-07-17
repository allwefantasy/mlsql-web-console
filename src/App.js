import React, { useState, useCallback, useEffect } from 'react';
import './App.scss';
import {AppConsole,AppConsoleContext} from './v1/app_console/AppConsole'
import { ActionProxy } from './backend_service/ActionProxy';
import RemoteAction from './backend_service/RemoteAction';
import AppSetup from './v1/app_setup/app_setup';
import { useReducerAsync } from 'use-reducer-async'
import { AppReducer, AppReducerHandlers, AppActionNames } from './v1/app/actions/AppReducer';
import SpinBox from './v1/SpinBox';

const initState = {
    appConfigured: false,
    loading: true
}
const AppContext = React.createContext()
function App() {
    const [state, dispacher] = useReducerAsync(AppReducer, initState, AppReducerHandlers)
    const {appConfigured,loading} = state

    async function getAppInfo() {
        const client = new ActionProxy()
        const appInfo = await client.get(RemoteAction.APP_INFO, {})
        if (appInfo.status === 200) {             
            dispacher({
                type: AppActionNames.appConfigured,
                data: {appConfigured: appInfo.content.configured,loading:false}
            })
        }

    }

    useEffect(() => {
        getAppInfo()
    }, [])

    return (
        <AppContext.Provider value={{dispacher}}>
            {loading && <SpinBox></SpinBox>}
            {!loading && appConfigured && <AppConsole/>}
            {!loading && !appConfigured && <AppSetup></AppSetup>}
        </AppContext.Provider>
    )
}
export default App
export {AppContext}