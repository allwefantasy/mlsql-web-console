import React, { useState, useCallback, useEffect } from 'react';
import { useDynamicList } from 'ahooks'
import { Form, Button, Input, Table } from 'antd';
import ReactDragListView from 'react-drag-listview';

function useCrudTable(props) {
    const { renderConfig, createInitRow, submit: externalSubmit } = props
    const [form] = Form.useForm()
    const [schema, setSchema] = useState([])
    const [data, setData] = useState([])
    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(false)
    const [editorMode, setEditorMode] = useState(false)

    const { list, remove, getKey, move, push, sortForm, resetList } = useDynamicList(data);
    const { getFieldsValue } = form;

    useEffect(() => {
        resetList(data)
    }, [data])

    const _columns = schema.filter(item => item !== "id").map(item => {
        if (renderConfig && renderConfig[item]) return renderConfig[item]({ getKey })
        return {
            title: item,
            dataIndex: item,
            key: item,
            render: (text, row, index) => (
                <>
                    <Form.Item name={`params[${getKey(index)}].${item}`} initialValue={text}>
                        <Input
                            style={{
                                width: 120,
                                marginRight: 16,
                            }}
                        />
                    </Form.Item>
                </>)

        }
    })
    const columns = _columns.concat([{
        key: 'operate',
        title: '',
        dataIndex: 'operate',
        render: (text, row, index) => (

            <>
                <Form.Item name={`params[${getKey(index)}].operate`}>
                    <Button.Group>
                        <Button type="danger" onClick={() => remove(index)}>
                            Delete
                    </Button>
                    </Button.Group>
                </Form.Item>

            </>
        ),
    }])

    const createRow = () => {
        if (createInitRow) {
            return createInitRow(columns)
        }
        const tempRow = {}
        columns.map(item => {
            tempRow[item] = ""
        })
        return tempRow
    }

    const submitNow = useCallback((values) => {
        setResult(values)
        var REG = /params\[(\d+)\]\.(\D+)/;
        const submit = async () => {
            const params = []
            Object.entries(values).map(([fieldName, fieldValue]) => {
                const matchFF = REG.exec(fieldName)
                const index = Number(matchFF[1])
                const field = matchFF[2]
                if (!params[index]) {
                    params[index] = {}
                }
                if (fieldValue) {
                    params[index][field] = fieldValue
                }
            })
            if (externalSubmit) {
                externalSubmit({ params, setLoading })
            }
        }
        submit()
    }, [setLoading])

    const ui = () => {  
        if(!editorMode){
            const newColumns = columns.map(item=>{
                item["render"] = (text, row, index)=>{
                    return <span>{text}</span>
                }
                return item
            })
            return <Table
            columns={newColumns}
            dataSource={data}            
            pagination={false}
        />
        }      
        return <>
            <Form form={form}>
                <ReactDragListView
                    onDragEnd={(oldIndex, newIndex) => move(oldIndex, newIndex)}
                    handleSelector={'i[aria-label="icon: drag"]'}
                >
                    <Table
                        columns={columns}
                        dataSource={list}
                        rowKey={(r, index) => getKey(index).toString()}
                        pagination={false}
                    />
                </ReactDragListView>
                <Button
                    style={{
                        marginTop: 8,
                    }}
                    block
                    type="dashed"
                    onClick={() =>
                        push(createRow())
                    }
                >
                    + Add Row
          </Button>
                <Button
                    type="primary"
                    style={{
                        marginTop: 16,
                    }}
                    loading={loading}
                    onClick={() => {
                        submitNow(getFieldsValue())
                    }}
                >
                    Submit
          </Button>
                {props.debug && <div
                    style={{
                        whiteSpace: 'pre',
                    }}
                >
                    {result && `content: ${JSON.stringify(result, null, 2)}`}
                </div>}
            </Form>
        </>
    }
    return { ui, data, schema, setData, setSchema, setLoading,setEditorMode }
}

export { useCrudTable }