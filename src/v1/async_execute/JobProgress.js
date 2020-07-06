import * as React from "react";
import { Statistic} from 'antd';
const { Countdown } = Statistic;

export default class JobProgress extends React.Component {
    constructor(props) {
        super(props)        
        this.state ={loading:false}
    }

    enter = (params) => {
        this.setState({loading:true})  

    }

    exit = () => {
        this.setState({loading:false})
    }

    render() {
        const deadline = Date.now()+ 1000 * 60 * 60 * 24 * 2 + 1000 * 30
        if(!this.state.loading) return <div></div>
        return <Countdown title="Time" value={deadline} format="mm:ss:SSS" />
    }
}