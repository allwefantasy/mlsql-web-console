import * as React from "react";
import 'antd/dist/antd.css';
import {Table} from 'antd';

export class MLSQLQueryDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {columns: [], rows: []}
    }

    update = (data) => {
        // e.g. [{"a":1}]

        let keys = []
        let basket = {}
        let rows = []
        console.log(data)
        //collect all keys
        data.forEach(function (item) {
            for (let key in item) {
                if (!basket[key]) {
                    keys.push({
                        title: key,
                        dataIndex: key,
                        key: key,
                    })
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
        console.log(rows)
        this.setState({columns: keys, data: rows})
    }

    render() {
        return (<div>
            <Table columns={this.state.columns} dataSource={this.state.data}/>
        </div>)
    }

}