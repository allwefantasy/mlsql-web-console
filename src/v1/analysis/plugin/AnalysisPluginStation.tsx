import React, { useEffect, useRef } from 'react'
import { useReducerAsync } from 'use-reducer-async'
import { Select } from "antd"
import { AnalysisPluginStationReducer, AnalysisPluginStationHandlers } from './actions/AnalysisPluginStationReducer'
import { FormattedMessage } from 'react-intl'
import { ActionProxy } from '../../../backend_service/ActionProxy'
import RemoteAction from '../../../backend_service/RemoteAction'
import { CommonActionNames } from '../common/CommonActionNames'
import { AnalysisPlugin } from '../../../common/useAnalysisPlugin'
import { AnalysisPluginForm } from './AnalysisPluginForm'
import { FormInstance } from 'antd/lib/form'
import './AnalysisPlugin.scss'
import { ApplySaveRollback } from '../../apply_save_rollback/ApplySaveRollback'
import AnalysisWorkshop from '../workshop'
import Tools from '../../../common/Tools'
import { SQLAnalysisUtils, FormType } from '../../../common/SQLAnalysisUtils'

interface Props {
}

const initState = {
  plugins: [] as Array<AnalysisPlugin>,
  pluginName: "",
  applySaveRollbackDispacher: undefined,
  applyToken: Tools.getJobName()
}

const AnalysisPluginStationContext = React.createContext<{ state: any, dispacher: React.Dispatch<any> } | null>(null)

const AnalysisPluginStation: React.FunctionComponent<Props> = (props) => {
  const [state, dispacher] = useReducerAsync(AnalysisPluginStationReducer, initState, AnalysisPluginStationHandlers)
  const proxy = new ActionProxy()
  const formRef = useRef<FormInstance | null>(null)
  const analysisUtilsRef = useRef<SQLAnalysisUtils | null>(null)

  const { applySaveRollbackDispacher, pluginName, plugins, applyToken } = state


  useEffect(() => {
    const fetch = async () => {
      const res = await proxy.get(RemoteAction.ANALYSIS_PLUGIN_LIST, {})
      if (res.status === 200) {
        dispacher({
          type: CommonActionNames.setState,
          data: {
            plugins: res.content as Array<AnalysisPlugin>
          }
        })
      }
    }
    fetch()
  }, [])


  const apply = async () => {
    if (applySaveRollbackDispacher) {
      const dataValues = formRef.current?.getFieldsValue()
      const analysisUtils = analysisUtilsRef.current  
      
      // const requiredFields = analysisUtils?.userInputs().filter(item=>{
      //   let formItem = {...item.option,name:item.key} as unknown as FormType
      //   formItem.required        
      // }).map(item=>item.key)

      // let fail:String
      // requiredFields?.forEach(item=>{
      //    if((dataValues as {[key:string]:any})[item] === undefined){
            
      //    }
      // })

      const sqls = analysisUtils?.toSql(dataValues as {})
      const workshop = AnalysisWorkshop.workshop
      const currentTable = workshop.getLastApplyTable().tableName
      const tableName = Tools.getTempTableName()
      const sql = `
      set __current_table__="${currentTable}";
      set __new_table__="${tableName}";
      ${sqls}
      `      
      const status = await workshop.apply({
        tableName,
        sql
      })
      if (status === 200) {
        workshop.refreshOperateStation()
      }
      applySaveRollbackDispacher({
        type: "setState",
        data: { loading: false }
      })
    }
  }

  useEffect(() => {
    apply()
  }, [applyToken])

  return (
    <AnalysisPluginStationContext.Provider value={{ state, dispacher }}>
      <ApplySaveRollback context={AnalysisPluginStationContext} />
      <div className="analysis-plugin-select">
        <Select showSearch onChange={(value) => {
          dispacher({
            type: CommonActionNames.setState,
            data: {
              pluginName: value
            }
          })
        }} filterOption style={{ width: "200px" }}>
          {
            plugins.map((item: AnalysisPlugin) => {
              return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
            })
          }
        </Select>
      </div>
      <div className="analysis-plugin-form">
        {pluginName && <AnalysisPluginForm analysisUtils={analysisUtilsRef} pluginName={pluginName} form={formRef} />}
      </div>
    </AnalysisPluginStationContext.Provider>
  )
}

export { AnalysisPluginStation, AnalysisPluginStationContext }