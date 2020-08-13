import React, { useState, useCallback, useEffect,useRef } from 'react';
import { Form, Input, Divider, Card, Checkbox, Select } from 'antd';
import { SQLAnalysisUtils, SelectType } from './SQLAnalysisUtils';
import { SetChunk, FormType, FormTypeEnum } from '../common/SQLAnalysisUtils'
import Tools from './Tools';
import { ActionProxy } from '../backend_service/ActionProxy';
import RemoteAction from '../backend_service/RemoteAction';
import { FormattedMessage } from 'react-intl'
import AnalysisWorkshop from '../v1/analysis/workshop';

export interface SelectItemData {
    name:string
    value:string
}

export interface AnalysisPlugin {
    name:string
    content:string
}
export const useAnalysisPlugin = (name: string) => {
    const [form] = Form.useForm()
    const [userInputs, setUserInputs] = useState<Array<SetChunk>>([])
    const [fieldLoading, setFieldLoading] = useState<{[key: string]: any}>({})
    const [fieldData, setFieldData] = useState<{[key: string]: any}>({})
    const analysisUtils = useRef<SQLAnalysisUtils|null>(null)
    // const [plugin, setPlugin] = useState<AnalysisPlugin>(null)
    const proxy = new ActionProxy()
    useEffect(() => {
        const fetch = async () => {            
            const res = await proxy.get(RemoteAction.ANALYSIS_PLUGIN_GET,{name})            
            if(res.status===200){
                const plugin = res.content as AnalysisPlugin                                
                analysisUtils.current = await new SQLAnalysisUtils(plugin.content).build()                
                setUserInputs(analysisUtils.current?.userInputs())
            }                        
        }
        fetch()
    }, [])

    const fetchSelect = useCallback((select: SelectType) => {
        const _fetch = async () => { 
            if(fieldData[select.name] && Object.keys(fieldData[select.name]).length > 0){
               return 
            }           
            if (select.optionStr) {
                setFieldData({
                    [select.name]: select.optionSql?.split(",").map((item) => {
                        return { name: item, value: item }
                    })
                })
                return
            }            
            const tableName = Tools.getTempTableName()
            if (select.optionTable) {

                if(select.optionTable === "__current_table_fields__"){
                    const data = AnalysisWorkshop.workshop.currentTable.schema.fields.map((item:{name:string})=>{
                        return {name:item.name,value:item.name}  
                    })
                    setFieldData({ [select.name]: data })
                    return 
                }

                const res = await proxy.runScript(`select * from ${select.optionTable} as ${tableName}`, Tools.getJobName(), Tools.robotFetchParam())
                let data = [] as Array<SelectItemData>
                if (res.status === 200) {
                    data = res.content.data as Array<SelectItemData>
                }
                setFieldData({ [select.name]: data })
                return
            }
            if (select.optionSql) {                              
                const res = await proxy.runScript(`${select.optionSql}`, Tools.getJobName(), Tools.robotFetchParam())
                let data = [] as Array<SelectItemData>
                if (res.status === 200) {
                    data = res.content.data as Array<SelectItemData>
                }
                setFieldData({ [select.name]: data })
                return
            }
        }
        _fetch()
    }, [])

    const toFormType = useCallback((sqlChunk: SetChunk) => {
        let formItem = {...sqlChunk.option,name:sqlChunk.key} as unknown as FormType        
        const mappings = {
            [FormTypeEnum.input]: () => {
                return <Form.Item
                    required={formItem.required}
                    name={formItem.name}
                    key={formItem.name}
                    initialValue={Tools.unQuote(sqlChunk.comamnd)}
                    label={formItem.label || formItem.name}>
                    <Input />
                </Form.Item>
            },
            [FormTypeEnum.select]: () => {
                return <Form.Item
                    required={formItem.required}
                    name={formItem.name}
                    key={formItem.name}
                    initialValue={Tools.unQuote(sqlChunk.comamnd)}
                    label={formItem.label || formItem.name}>
                    <Select showSearch onFocus={() => {
                        fetchSelect(formItem as SelectType)
                    }} loading={fieldLoading[formItem.name] || false} mode={(formItem as SelectType).selectMode}>
                        {console.log(fieldData)}
                        {fieldData[formItem.name]?.map((item:SelectItemData) => {
                            return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
            }
        }
        return mappings[formItem.formType]()
    }, [fieldData])
    const ui = () => {
        return <>
            <Form form={form}>
                {
                    userInputs.map(sqlChunk => {
                        return toFormType(sqlChunk)
                    })
                }

            </Form>
        </>
    }
    return { ui, form ,analysisUtils}
}