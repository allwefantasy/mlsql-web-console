import * as React from "react";
import { Table, Modal } from 'antd';
import mix from "../../common/mixin";
import { SearchOp } from "./real_time_view_table/SearchOp";
import { DropdownMenuUI } from "./real_time_view_table/DropdownMenuUI";
import MLSQLHTML from "../../components/dash/MLSQLHTML";
import AnalysisWorkshop from "./workshop";
import AceEditor from "react-ace";


const ReactMarkdown = require('react-markdown')

export default class RealTimeViewTable extends mix(React.Component).with(
    SearchOp,
    DropdownMenuUI
) {
    constructor(props) {
        super(props)
        this.tableStyle = props.style || {}
        this.state = {
            columns: [],
            rows: [],
            view: { enabled: false },
            searchText: '',
            searchedColumn: '',
            loading: false,
            isDash: false
        }
        this.config = {}
        this.workshop = AnalysisWorkshop.workshop
    }

    wrapper = (v)=>{
        return <div onDoubleClick={(evt)=>{                
            evt.preventDefault()
            evt.stopPropagation()
            this.setState({view:{enabled:true,content:v}})
    
        }}>{v}</div>
    }

    getDefaultRender = item => {
        const { name, type } = item
       

        if ((typeof type) === "object" || (typeof type) === "array") {
            return (value, record) => {                
                const v = JSON.stringify(value)
               return this.wrapper(v) 
            }
        }

        switch (type) {
            case "string": return (value, record) => {
                return  this.wrapper(value)
            }
            default:
                return (value, record) => { return String(value) }

        }
    }

    getDefaultSearch = item => {
        const { name, type } = item
        switch (type) {
            case "string": return this.getColumnSearchProps(name)
            case "array": return {}
            case "map": return {}
            default:
                return {}
        }
    }

    getDefaultTitleRender = item => {
        return this.dropdown(item)
    }

    update = (rows, columns) => {
        let isDash = false
        if (columns[0] && columns[0].name === "html" && columns[1] && columns[1].name === "dash") {
            isDash = true
        }
        const newColumns = columns.map(item => {
            return {
                ...item,
                dataIndex: item.name,
                title: this.getDefaultTitleRender(item),
                render: this.getDefaultRender(item),
                width: 200,
                textWrap: 'word-break',
                ellipsis: {showTitle:true},
                ...this.getDefaultSearch(item)
            }
        })

        this.setState({ columns: newColumns, data: rows, isDash })
    }

    disablePreview = () => {
        this.setState({
            view: {
                enabled: false
            }
        })
    }
    
    render() {
        const self = this
        if (this.state.isDash) {
            return MLSQLHTML.render(this.state.data)
        }
        return (<div style={this.tableStyle}>
            <Table                 
                loading={this.state.loading}
                size='default'
                columns={this.state.columns}
                dataSource={this.state.data}
                scroll={{ x: 'max-content' }}
                
            />
            <Modal
                title={"View"}
                visible={this.state.view.enabled}
                onCancel={this.disablePreview}
                onOk={this.disablePreview}
                cancelText="Cancel"
                OkText="Ok"
            >
                <AceEditor
                        height={"300px"}
                        width={"100%"}
                        mode="text"
                        theme="github"
                        name="detail_box"
                        value={this.state.view.content || ""}
                    ></AceEditor>                
            </Modal>
        </div>
        )
    }

}