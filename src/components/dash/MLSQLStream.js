import React, {Component} from 'react';
import {TimelineChart} from "../../../node_modules/ant-design-pro/lib/Charts";
import moment from "moment";


export default class MLSQLStream extends Component {

    constructor(props) {
        super(props);
        this.queryApp = props.parent.parent
        this.state = {data: props.data, dataForRender: [], titleMap: {}}

    }

    componentDidMount() {
        this.renderStream()
    }

    static isStream = (data) => {
        if (data.length < 1) {
            return false
        }
        try {
            const item = JSON.parse(data[0]["value"])
            if (!item["runId"]) {
                return false
            }
        } catch (e) {
            return false
        }

        return true
    }

    static isShouldRender = (data) => {
        return MLSQLStream.isStream(data)
    }

    renderStream = () => {
        const data = this.state.data
        const dataForRender = []
        const dataForRender2 = []

        data.forEach((item) => {
            const jsonItem = JSON.parse(item["value"])
            const x = moment.utc(jsonItem.timestamp).toDate().getTime()
            dataForRender.push({
                x: x,
                y1: jsonItem.inputRowsPerSecond,
                y2: jsonItem.processedRowsPerSecond
            })

            dataForRender2.push({
                x: x,
                y1: jsonItem.numInputRows
            })
        })
        this.setState({
            dataForRender: dataForRender,
            titleMap: {y1: "inputRowsPerSecond", y2: "processedRowsPerSecond"},
            dataForRender2: dataForRender2,
            titleMap2: {y1: "numInputRows"}
        })
    }

    static renderRawData = (data) => {
        if (!MLSQLStream.isShouldRender(data)) return ""
        const dataForRender = []
        data.forEach((item) => {
            const jsonItem = JSON.parse(item["value"])
            dataForRender.push(JSON.stringify(jsonItem, null, 2))
        })
        return dataForRender.join("\n")
    }

    render() {
        if (this.state.dataForRender.length === 0) return null
        return <div>
            <TimelineChart
                height={200}
                data={this.state.dataForRender}
                titleMap={this.state.titleMap}
            />
            <TimelineChart
                height={200}
                data={this.state.dataForRender2}
                titleMap={this.state.titleMap2}
            />
        </div>
    }

}

