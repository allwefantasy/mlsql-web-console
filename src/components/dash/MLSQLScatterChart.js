import React, {PureComponent} from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const randomColor = require('randomcolor');
const generateColor = () => {
    let color = randomColor()
    if (color === "#000000") {
        color = "#8884d8"
    }
    return color
}

export default class MLSQLThreeDimScatterChart {


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
        return MLSQLThreeDimScatterChart.basicCheck(data, (item) => {

            return item.hasOwnProperty("x") && item.hasOwnProperty("y") && (item.hasOwnProperty("_dash_config") || item.hasOwnProperty("dash")) && (
                item["dash"] === "scatter" || (item["_dash_config"] || {})["dash"] === "scatter"
            )
        })
    }

    static render(data) {
        let haveZ = data[0].hasOwnProperty("z")
        if (!data.hasOwnProperty("dataType")) {
            data.forEach((item) => {
                item["dataType"] = "default"
                if (!haveZ) {
                    item["z"] = 0
                }
            })
        }
        const dataTypeToItems = data.reduce((map, item) => {
            const {x, y, z, dataType} = item
            const prev = map.get(dataType)
            if (prev) {
                prev.push(item)
            } else {
                map.set(dataType, [item])
            }
            return map
        }, new Map())

        const item = data[0]
        const _config = item["_dash_config"] || {}

        const scatters = [...dataTypeToItems.keys()].map((key) => {
            const dataTypeConfig = Object.assign({fill: generateColor(), shape: "triangle"}, (_config[key] || {}))
            return <Scatter key={key} name={key} data={dataTypeToItems.get(key)} {...dataTypeConfig}/>
        })


        const xConfig = Object.assign({type: "number", dataKey: "x"}, (_config["x"] || {}))
        const yConfig = Object.assign({type: "number", dataKey: "y"}, (_config["y"] || {}))
        const zConfig = Object.assign({type: "number", dataKey: "z"}, (_config["z"] || {}))


        return (
            <ScatterChart
                width={400}
                height={400}
                margin={{
                    top: 20, right: 20, bottom: 20, left: 20,
                }}
            >
                <CartesianGrid/>
                <XAxis {...xConfig}/>
                <YAxis {...yConfig}/>
                {haveZ ? <ZAxis {...zConfig}/> : ""}
                <Tooltip cursor={{strokeDasharray: '3 3'}}/>
                <Legend/>
                {scatters}
            </ScatterChart>
        );
    }

}

