import React, { useState, useCallback, useEffect } from 'react';
import './App.scss';
import APPConsole from "./APPConsole"
import { ActionProxy } from './backend_service/ActionProxy';
import RemoteAction from './backend_service/RemoteAction';
import AppSetup from './v1/app_setup/app_setup';


function App() {
    const [appConfigured, setAppConfigured] = useState(false)
    const client = new ActionProxy()

    async function getAppInfo() {
        const appInfo = await client.get(RemoteAction.APP_INFO, {})
        if (appInfo.status === 200) {
            setAppConfigured(appInfo.content.configured)
        }
        
    }

    useEffect(() => {
        getAppInfo()
    }, [])

    if (!appConfigured) return <AppSetup></AppSetup>
    return (
        <APPConsole></APPConsole>
    )
}
export default App