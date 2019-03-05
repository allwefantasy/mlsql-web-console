import React, {PureComponent} from 'react';
import {
    XAxis,
    YAxis,
    LineChart,
    CartesianGrid,
    Legend,
    Line,
    Tooltip as JTooltip,
    Bar as JBar,
    BarChart,
} from 'recharts';

const randomColor = require('randomcolor');
const generateColor = () => {
    let color = randomColor()
    if (color === "#000000") {
        color = "#8884d8"
    }
    return color
}

export default class MLSQLLineChart {


    static basicCheck = (data, fun) => {
        if (data.length < 1) {
            return false
        }

        try {
            return fun(data[0])
        } catch (e) {
            return false
        }

        return true
    }

    static isShouldRender = (data) => {
        return MLSQLLineChart.basicCheck(data, (item) => {
            return item.hasOwnProperty("x") && (item.hasOwnProperty("dash") || item.hasOwnProperty("_dash_config"))
        })
    }

    static render(data) {
        const item = data[0]
        const ys = []
        const _config = item["_dash_config"] || {}
        if (item["dash"] === "line" || _config["dash"] === "line") {
            Object.keys(item).forEach((key) => {
                if ((typeof item[key]) === "number") {
                    const dataTypeConfig = Object.assign({stroke: generateColor()}, (_config[key] || {}))
                    ys.push(<Line key={key} type="monotone" dataKey={key} {...dataTypeConfig}/>)
                }
            })
            return <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <JTooltip/>
                <Legend/>
                {ys}
            </LineChart>
        }


        if (item["dash"] === "bar" || _config["dash"] === "bar") {
            Object.keys(item).forEach((key) => {
                if ((typeof item[key]) === "number") {
                    const dataTypeConfig = Object.assign({fill: generateColor()}, (_config[key] || {}))
                    ys.push(<JBar key={key} dataKey={key} {...dataTypeConfig}/>)
                }
            })
            return <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="x"/>
                <YAxis/>
                <JTooltip/>
                <Legend/>
                {ys}
            </BarChart>
        }
    }

}