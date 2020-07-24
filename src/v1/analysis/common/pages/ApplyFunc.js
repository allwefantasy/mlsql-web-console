import React, { useState, useCallback, useEffect } from 'react';
import { Select, Form, Input, Switch, Divider } from 'antd';
import EngineService from '../../../service/EngineService';
import FuncDesc from '../../FuncDesc';
import Tools from '../../../../common/Tools';
import AlertBox from '../../../AlertBox';

function useFieldTransform(props) {
    const { operateField } = props
    const [funcs, setFuncs] = useState([])
    const [currentFunc, setCurrentFunc] = useState(undefined)
    const [form] = Form.useForm()
    const [error, setError] = useState(undefined)

    const fetchFuncs = async () => {
        const res = await EngineService.showFunctions()
        const data = res.content.map((item) => {
            return {
                value: item.key.table,
                text: item.key.table,
                funcValue: item.columns[0],
                returnValue: item.columns[1],
                params: item.columns.slice(2, item.columns.length)
            }
        })
        setFuncs(data)
    }
    useEffect(() => {
        fetchFuncs()
    }, [])

    const handleChange = useCallback(async (value) => {
        const currentFunc = funcs.filter(item => item.value === value)[0]
        setCurrentFunc(currentFunc)
    }, [funcs])

    const showColumn = (item) => {
        if (item.extra.column === "yes") {
            return operateField
        } else return ""
    }

    const getTransform = () => {
        const { mannualTransform, isMannualAgg, newFieldName } = form.getFieldValue()
        if (mannualTransform) {
            return {
                field: operateField,
                isAgg: isMannualAgg || false,
                transformCode: mannualTransform,
                columnName: newFieldName
            }
        }
        if(!currentFunc){
            setError("Operate is required.")
            return {}
        }
        const params = []
        currentFunc.params.forEach(item => {
            let v = form.getFieldValue()[item.name]
            if (!v && item.extra.column === "yes") {
                v = operateField
            }
            if (v) {
                if (item.extra.column === "yes") {
                    params.push(Tools.getField(v))
                } else if (item.dataType == "number" || item.dataType == "boolean") {
                    params.push(v)
                }
                else {
                    params.push(`"${v}"`)
                }
            }
        })
        const field = operateField
        const isAgg = currentFunc.funcValue.extra.agg === "yes"
        return { field, isAgg, transformCode: `${currentFunc.value}(${params.join(",")})`, columnName: newFieldName }
    }


    const ui = (commands) => {
        return <Form form={form} className="login-form">
            {
                error && <AlertBox onClose={() => { setError(undefined) }} message={error}></AlertBox>
            }
            <Form.Item label={"Search function"}>
                <Select
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={true}
                    style={{ width: "200px" }}
                    filterOption={true}
                    onChange={handleChange}
                    notFoundContent={"type function name"}
                >
                    {funcs.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                </Select>
            </Form.Item>

            {
                currentFunc && <Form.Item key={currentFunc.value}><FuncDesc func={currentFunc}></FuncDesc></Form.Item>
            }
            {
                currentFunc && currentFunc.params.map(item => {
                    return <Form.Item initialValue={showColumn(item)} key={item.name} name={item.name} label={item.name}><Input  />
                    </Form.Item>
                })
            }
            <Form.Item name="newFieldName" label="New Field Name" required><Input /></Form.Item>
            <Divider type="horizontal" />
            <Form.Item name="mannualTransform" label="Mannual Transform"><Input /></Form.Item>
            <Form.Item name="isMannualAgg" label="Is Agg Function"><Switch></Switch></Form.Item>
            {commands}
        </Form>
    }
    return {
        ui, form, getTransform, setError
    }
}
export { useFieldTransform }