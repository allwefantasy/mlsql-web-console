import * as React from "react";
import 'antd/dist/antd.css';
import {Table,Modal} from 'antd';


const ReactMarkdown = require('react-markdown')

export default class ColumnOperate extends React.Component {
    constructor(props) {
        super(props)
        this.tableStyle = props.style || {}
        this.state = {columns: [], rows: [], view: {enabled: false}}
        this.config = {}
    }

    setRender = (keyColumn, data) => {

        const value = data[0][keyColumn.key]

        if (this.config && this.config["render"]) {            
            Object.keys(this.config).map(k=>{
                const v = this.config[k][keyColumn.key] 
                if(v){
                    keyColumn[k] = v
                }
            })
            return
        }

        try {
            if (React.Component.isPrototypeOf(value.type)) {
                keyColumn["render"] = value => <span>{value}</span>
                return
            }
        }
        catch (e) {
        }

        if (keyColumn.key == "html") {            
            keyColumn["render"] = value => <pre>{value.substring(0,300)}</pre>
            return
        }

        if ((typeof value) === 'object') {
            keyColumn["render"] = value => <span>{JSON.stringify(value).substring(0, 300)}</span>
            return
        }
        if ((typeof value) === 'array') {
            keyColumn["render"] = value => <span>{value.join(",").substring(0, 300)}</span>
            return
        }
        if ((typeof value) === 'boolean') {
            keyColumn["render"] = value => <span>{value.toString()}</span>
            return
        }
        if (keyColumn.key == "fileSystem" || keyColumn.key == "message" || keyColumn.key == "info") {
            keyColumn["render"] = value => <pre>{value.toString()}</pre>
            return
        }


    }

    update = (data, config) => {
        // e.g. [{"a":1}]
        this.config=config
        let keys = []
        let basket = {}
        let rows = []
        const self = this
        //collect all keys
        data.forEach(function (item) {
            for (let key in item) {
                if (!basket[key]) {
                    const keyColumn = {
                        title: key,
                        dataIndex: key,
                        key: key,
                    }
                    self.setRender(keyColumn, data)
                    keys.push(keyColumn)
                    basket[key] = true
                }
            }
        })

        // collect data
        data.forEach(function (item, index) {
            let new_item = {}
            keys.forEach(function (key) {
                new_item[key.key] = item[key.key]
            })
            new_item["key"] = index
            rows.push(new_item)
        })

        this.setState({columns: keys, data: rows})
    }

    rowDoubleClick = (row, index, event) => {
        if (row.name === "codeExample" || row.name === "doc") {
            this.setState({
                view: {
                    enabled: true,
                    content: row.value
                }
            })
        }
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
        return (<div style={this.tableStyle}>
                <Table    
                    size ='default'
                    columns={this.state.columns}
                    dataSource={this.state.data}
                    scroll = {{x:'70vw',y:600}}                                      
                    />
                <Modal
                    title={"View"}
                    visible={this.state.view.enabled}
                    onCancel={this.disablePreview}
                    onOk={this.disablePreview}
                    cancelText="Cancel"
                    OkText="Ok"
                >
                    <ReactMarkdown source={this.state.view.content || ""}/>
                </Modal>
            </div>
        )
    }

}