import React, { useState, useCallback, useEffect } from 'react';
import { Select, Input, Form } from 'antd';
import { ActionProxy } from '../../../backend_service/ActionProxy';
import Tools from '../../../common/Tools';

const ExpressionConst = {
    EQUAL: "=",
    NON_EQUAL: "!=",
    IN: "in",
    CONTAINS: "contains",
    STARTS_WITH: "startsWith",
    ENDS_WITH: "endsWith",
    LIKE: "like",
    IS_NULL: "is null",
    IS_NOT_NULL: "is not null",
    IS_EMPTY: "is empty",
    IS_NOT_EMPTY: "is not empty",

}

const buildExpression = (item) => {
    const { field, dataType, compare, condition } = item
    if (compare === ExpressionConst.IN) {

        let conTemp = ""

        switch (dataType) {
            case "integer": case "long": case "float": case "double":
                conTemp = condition.map(cond => {
                    return cond
                }).join(",")
                break
            default:
                conTemp = condition.map(cond => {
                    return `"${Tools.escapeQuote(cond)}"`
                }).join(",")
        }
        const con = `(${conTemp})`
        return `${Tools.getField(field)} ${compare} ${con}`
    }

    if (compare === ExpressionConst.IS_NOT_NULL || compare === ExpressionConst.IS_NULL) {
        return `${Tools.getField(field)} ${compare}`
    }

    if (compare === ExpressionConst.IS_EMPTY) {
        return `${Tools.getField(field)} = ""`
    }

    if (compare === ExpressionConst.IS_NOT_EMPT) {
        return `${Tools.getField(field)} != ""`
    }

    if (compare === ExpressionConst.LIKE) {
        return `${Tools.getField(field)} like "${Tools.escapeQuote(condition)}"`
    }

    if (compare === ExpressionConst.STARTS_WITH) {
        return `${Tools.getField(field)} like "${Tools.escapeQuote(condition)}%"`
    }

    if (compare === ExpressionConst.ENDS_WITH) {
        return `${Tools.getField(field)} like "%${Tools.escapeQuote(condition)}"`
    }

    let con = ""
    switch (dataType) {
        case "string":
            con = `"${Tools.escapeQuote(condition)}"`
            break
        default: con = condition;
    }
    return `${Tools.getField(field)} ${compare} ${con}`
}
function FilterCondition(props) {
    const { record, workshop } = props
    const [compare, setCompare] = useState(undefined)
    const { dataType, field } = record
    const [inCandidate, setInCandidate] = useState([])
    const [inCandidateLoading, setInCandidateLoading] = useState(false)
    const [form] = Form.useForm()
    props.forms[field] = form

    const fetch = async () => {
        if (inCandidate.length === 0 && compare === "in") {
            setInCandidateLoading(true)
            
            const res =  await workshop.runSQLAtCurrentTable(`select distinct(${Tools.getField(field)}) as name 
            from ${workshop.getLastApplyTable().tableName} 
            as ${Tools.getTempTableName()};`,{outputSize: 5000, timeout: 10000 })
            
            if (res.status === 200) {
                setInCandidate(res.content.data)
            }
            setInCandidateLoading(false)
        }
    }

    useEffect(() => {
        fetch()
    }, [compare])

    const condition = () => {
        switch (compare) {
            case ExpressionConst.IS_NULL:
                return <></>
            case ExpressionConst.IS_NOT_NULL:
                return <></>
            case ExpressionConst.IN:
                return <Select loading={inCandidateLoading} mode="tags" style={{ width: '100px' }}>
                    {inCandidate.map(item => {
                        return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                    })}
                </Select>

            case ExpressionConst.LIKE:
                return <><Input style={{ width: '100px' }} /><span>LIKE 'a%o' means Finds any values that start with 'a' and ends with 'o' </span></>

            default:
                return <Input style={{ width: '100px' }} />
        }
    }

    const ui = () => {
        return <Form form={form} layout={"inline"}>
            <Form.Item name="compare" initialValue={record.compare}>
                <Select initialValue={"="}
                    onChange={(value) => {
                        setCompare(value)
                        record.compare = value
                    }}
                    placeholder="compare" style={{width:"100px"}}>
                    <Select.Option value="=">=</Select.Option>
                    <Select.Option value="<">{'<'}</Select.Option>
                    <Select.Option value=">">{'>'}</Select.Option>
                    <Select.Option value=">=">{'>='}</Select.Option>
                    <Select.Option value="<=">{'<='}</Select.Option>
                    <Select.Option value="!=">{'!='}</Select.Option>
                    <Select.Option value={ExpressionConst.LIKE}>{'like'}</Select.Option>
                    <Select.Option value={ExpressionConst.STARTS_WITH}>{'startsWith'}</Select.Option>
                    <Select.Option value={ExpressionConst.ENDS_WITH}>{'endsWith'}</Select.Option>
                    <Select.Option value={ExpressionConst.IN}>{'in'}</Select.Option>
                    <Select.Option value={ExpressionConst.IS_NULL}>{'is null'}</Select.Option>
                    <Select.Option value={ExpressionConst.IS_NOT_NULL}>{'is not null'}</Select.Option>
                    <Select.Option value={ExpressionConst.IS_EMPTY}>{'is empty'}</Select.Option>
                    <Select.Option value={ExpressionConst.IS_NOT_EMPTY}>{'is not empty'}</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name="condition" initialValue={record.condition} onChange={(value)=>{
                if(typeof value !== "string"){
                    record.condition = value.target.value
                }else record.condition = value
                
            }}>
                {condition()}
            </Form.Item>
        </Form>
    }
    return ui()
}
export { FilterCondition, ExpressionConst, buildExpression }