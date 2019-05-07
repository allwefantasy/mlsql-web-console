import React, {Component} from 'react';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Legend} from 'recharts';
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
            const x = moment.utc(jsonItem.timestamp).format('DD,h:mm:ss')
            dataForRender.push({
                x: x,
                inputRowsPerSecond: jsonItem.inputRowsPerSecond,
                processedRowsPerSecond: jsonItem.processedRowsPerSecond
            })

            dataForRender2.push({
                x: x,
                numInputRows: jsonItem.numInputRows
            })
        })
        this.setState({
            dataForRender: dataForRender,
            dataForRender2: dataForRender2
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

            <LineChart width={800} height={300} data={this.state.dataForRender}>
                <Line type="monotone" dataKey="inputRowsPerSecond" stroke="#8884d8"/>
                <Line type="monotone" dataKey="processedRowsPerSecond" stroke="#82ca9d"/>
                <CartesianGrid stroke="#ccc"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Legend/>
            </LineChart>

            <LineChart width={800} height={300} data={this.state.dataForRender2}>
                <Line type="monotone" dataKey="numInputRows" stroke="#8884d8"/>
                <CartesianGrid stroke="#ccc"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <Legend/>
            </LineChart>
        </div>
    }

}

