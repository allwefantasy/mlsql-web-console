import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import { DashStationReducer, DashStationHandlers } from './actions/DashStationReducer';
import './DashStation.scss'
import { Form, Input, Select, Divider } from 'antd';
import { useDataConfig } from './pages/useDataConfig';
import { useDashConfig } from './pages/useDashConfig';
import { ActionProxy } from '../../../backend_service/ActionProxy';
import RemoteAction from '../../../backend_service/RemoteAction';
import Tools from '../../../common/Tools';
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback';


const initState = {
    applySaveRollbackDispacher: undefined,
    scriptContent:undefined
}

const DashStationContext = React.createContext()

function DashStation(props) {
    const workshop = props.parent.workshop
    const [state, dispacher] = useReducerAsync(DashStationReducer, initState, DashStationHandlers)
    const { ui: dataUi, form: dataForm, vType, setPlugins } = useDataConfig(props)
    const { ui: dashUi, form: dashForm, setPluginConfigs } = useDashConfig(props)
    const proxy = new ActionProxy()
    const { applySaveRollbackDispacher,scriptContent } = state


    const fetchDashPlugins = async () => {

        const res = await proxy.get(RemoteAction.PLUGIN_LIST, {})
        if (res.status !== 200) {
            return
        }
        const dashPlugins = res.content.map(item => item.name)
        setPlugins(dashPlugins)
    }

    const fetchPlugin = async () => {
        if (vType) {
            const res = await proxy.get(RemoteAction.PLUGIN_GET, { pluginName: vType })
            const scriptContent = res.content.content
            const analyzedScriptContent = await proxy.runScript(scriptContent, Tools.getJobName(), { executeMode: "analyze" })
            if (analyzedScriptContent.status !== 200) {
                return
            }
            const pluginConfigs = analyzedScriptContent.content.filter(sql => {
                return sql.mode && (sql.mode === "defaultParam")
            })
            dispacher({
                type:"setState",
                data:{scriptContent}
            })
            setPluginConfigs(pluginConfigs)
        }
    }
    useEffect(() => {
        fetchPlugin()
    }, [vType])

    useEffect(() => {
        fetchDashPlugins()
    }, [])

    const apply = async () => {
        if (applySaveRollbackDispacher) {
            const dataValues = dataForm.getFieldValue()
            const dashValues = dashForm.getFieldValue()
            
            const tableName = dashValues.tableName || Tools.getTempTableName()
            const sql = `
             select ${Tools.getField(dataValues.xColumn)} as x,${Tools.getField(dataValues.yColumn)} as y 
             from ${workshop.getLastApplyTable().tableName} as ${tableName};
             ${scriptContent}
            `
            await workshop.apply({tableName,sql})
            
            applySaveRollbackDispacher({
                type: "setState",
                data: { loading: false }
            })
        }
    }
    useEffect(()=>{
        apply()
    }, [applySaveRollbackDispacher])

    return (
        <DashStationContext.Provider value={{ dispacher }}>
            <ApplySaveRollback workshop={workshop} context={DashStationContext} />
            <div className="dash-station">
                <div className="dash-station-data-page">
                    {dataUi()}
                </div>
                <Divider type="vertical" style={{ height: "300px" }} />
                <div className="dash-station-dash-page">
                    {dashUi()}
                </div>
            </div>
        </DashStationContext.Provider>
    )
}
export { DashStation, DashStationContext }