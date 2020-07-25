import React, { useState, useCallback, useEffect } from 'react';
import { useReducerAsync } from 'use-reducer-async'
import MLSQLLineChart from '../../../../components/dash/MLSQLLineChart';

function useRealTimeDash(props) {
    const [data, setData] = useState([])
    const [config, setConfig] = useState({})
    const ui = () => {
        if(data.length===0) return <></>
        return MLSQLLineChart.render(data)
    }
    return {
        ui, setData, setConfig
    }
}

function RealTimeDash(props){
    const {
        ui, setData, setConfig
    } = useRealTimeDash(props)
    return ui()
}

export { RealTimeDash }