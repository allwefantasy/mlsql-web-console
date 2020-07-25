import React from 'react';
import {Resizable} from "re-resizable";


export default class MLSQLHTML {


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
        return MLSQLHTML.basicCheck(data, (item) => {
            return item.hasOwnProperty("html") && (item.hasOwnProperty("dash") || item.hasOwnProperty("_dash_config"))
        })
    }

    static render(data) {        
        const item = data[0]    
        return <MLSQLHTMLPanel data={item}></MLSQLHTMLPanel>
    }

}

export class MLSQLHTMLPanel extends React.Component {


    constructor(props) {
        super(props)
        this.state = {data: this.props.data}
    }

    refresh = (data) => {
        this.setState({data: data})
    }

    render() {
        console.log(this.state.data)
        return (
            <div style={{width:"100%"}}>
                <Resizable defaultSize={{height: "500px"}}>
                    <iframe
                        sandbox="allow-scripts"
                        style={{width: '100%', height: "100%"}}
                        srcDoc={this.state.data["html"]}
                        frameBorder="0"
                        scrolling="yes"
                        ref={(f) => {
                            this.ifr = f;
                        }}

                    />
                </Resizable>
            </div>
        );
        
    }


}