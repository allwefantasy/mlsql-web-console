import React, { useState, useCallback, useEffect } from 'react';
import { Alert } from 'antd'
import { useReducerAsync } from 'use-reducer-async'
import { AppConsoleReducer, AppConsoleHandlers, AppConsoleActionNames } from './actions/AppConsoleReducer';
import './AppConsole.scss'
import { ConsoleHeader } from './pages/ConsoleHeader';
import { Register } from './login_register/Register';
import { Login } from './login_register/Login';
import ActionMaker from '../ActionMaker';
import MLSQLQueryApp from '../../components/MLSQLQueryApp';
import AnalysisWorkshop from '../analysis/workshop';
import { AdminSetting } from './admin/AdminSetting';
import UIMaker from '../UIMaker';
import Modal from 'antd/lib/modal/Modal';
import { Settings } from './admin/pages/Settings';

const initState = {
    currentPage: "login",
    logined: false
}

const AppConsoleContext = React.createContext()

function AppConsole() {
    const [state, dispacher] = useReducerAsync(AppConsoleReducer, initState, AppConsoleHandlers)
    const { currentPage, logined } = state

    useEffect(() => {
        dispacher(ActionMaker.buildEvent(AppConsoleActionNames.CHECK_LOGINED, {}))
    }, [])

    return (
        <AppConsoleContext.Provider value={{ dispacher }}>
            <div className="app-console">
                <div className="app-console-header">
                    <ConsoleHeader userLogined={logined} isUserAdmin={UIMaker.isAdmin()} currentPage={currentPage}></ConsoleHeader>
                </div>
                <div className="app-console-main">
                    {currentPage === "register" && <Register></Register>}
                    {currentPage !== "register" && !logined && <Login></Login>}
                    {currentPage === "console" && logined && <MLSQLQueryApp></MLSQLQueryApp>}
                    {currentPage === "workshop" && logined && <AnalysisWorkshop></AnalysisWorkshop>}
                    {currentPage === "admin" && logined && UIMaker.isAdmin() && <AdminSetting></AdminSetting>}
                    {currentPage === "settings" && logined && <Settings></Settings>}
                </div>
                <div className="app-console-footer">
                    <div style={{ bottom: "100px", textAlign: "center", width: "100%" }}>
                        MLSQL Licensed under the Apache License, Version 2.0. @<a className="copyright"
                            href="http://www.miitbeian.gov.cn/">浙ICP备18052520号</a>
                        <div>@<a target="_blank"
                            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010802009683"><img
                                src="" />浙公网安备 33010802009683号</a></div>

                    </div>
                </div>
            </div>

        </AppConsoleContext.Provider>
    )
}
export { AppConsole, AppConsoleContext }