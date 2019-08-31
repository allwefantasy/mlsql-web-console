import * as React from "react";
import 'antd/dist/antd.css';
import {Table, Modal} from 'antd';

const ReactMarkdown = require('react-markdown')


export default class DataTable extends React.Component {

    constructor(props) {
        super(props)
        const [keys, rows] = this.parseData(props.data || [], props.config || {})
        this.state = {columns: keys, rows: rows, view: {enabled: false}}
    }

    setRender = (keyColumn, data, config) => {

        const value = data[0][keyColumn.key]

        if (config && config["render"]) {
            const render = this.state.config["render"][keyColumn.key]
            if (render) {
                keyColumn["render"] = render
            }
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

    parseData = (data, config) => {
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
        return [keys, rows]
    }

    update = (data, config) => {
        // e.g. [{"a":1}]
        const [keys, rows] = this.parseData(data, config)
        this.setState({columns: keys, data: rows, config: config})
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
        return (<div>
                <Table
                    onRow={(row, index) => {
                        return {
                            onDoubleClick: (event) => {
                                self.rowDoubleClick(row, index, event)

                            }
                        }
                    }
                    }

                    columns={this.state.columns}
                    dataSource={this.state.rows}/>
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