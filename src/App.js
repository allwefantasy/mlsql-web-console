import React, { useState, useCallback, useEffect } from 'react';
import './App.scss';
import { AppConsole, AppConsoleContext } from './v1/app_console/AppConsole'
import { ActionProxy } from './backend_service/ActionProxy';
import RemoteAction from './backend_service/RemoteAction';
import AppSetup from './v1/app_setup/app_setup';
import { useReducerAsync } from 'use-reducer-async'
import { AppReducer, AppReducerHandlers, AppActionNames } from './v1/app/actions/AppReducer';
import SpinBox from './v1/SpinBox';
import { ConfigProvider } from 'antd';
import {IntlProvider} from "react-intl"
import zh_CN from './locale/zh_CN';
import en_US from './locale/en_US';
import AntZhCN from 'antd/lib/locale-provider/zh_CN';

const initState = {
    appConfigured: false,
    loading: true,
    lang: "zh",
    enableConsole: false
}
const AppContext = React.createContext()
function App() {
    const [state, dispacher] = useReducerAsync(AppReducer, initState, AppReducerHandlers)
    const { appConfigured, loading,lang,enableConsole } = state

    async function getAppInfo() {
        const client = new ActionProxy()
        const appInfo = await client.get(RemoteAction.APP_INFO, {})
        if (appInfo.status === 200) {
            dispacher({
                type: AppActionNames.appConfigured,
                data: { 
                    appConfigured: appInfo.content.configured, 
                    enableConsole: appInfo.content.console || false, 
                    loading: false }
            })
        }

    }

    useEffect(() => {
        getAppInfo()
    }, [])

    return (
        <IntlProvider locale={lang} messages={zh_CN}>
        <ConfigProvider locale={AntZhCN}>
            <AppContext.Provider value={{ dispacher }}>                
                {loading && <SpinBox />}
                {!loading && !appConfigured && <AppSetup />}
                {!loading && appConfigured && <AppConsole appInfo={{enableConsole}}/>}
            </AppContext.Provider>
        </ConfigProvider>
        </IntlProvider>

    )
}
export default App
export { AppContext }