import * as React from "react";
import {Card} from "antd";
import AceEditor from "react-ace";


export default class ResultView extends React.Component {

    constructor(props) {
        super(props);
        this.nav = props.nav
        this.state = {content: ""}

    }

    componentDidMount() {
        this.setState({
            content: Object.entries(this.nav.collected_params).filter((item) => {
                return item[1]
            }).map((item) => {
                return `set ${item[0]}='''${item[1]}''';`
            }).join("\n") + `\ninclude plugin.\`${this.nav.current_plugin_name}\`;`
        })
    }


    render() {

        return (


            <div className="steps-content"
                 style={{"margin-top": "30px"}}>
                <pre>
                    {this.state.content}
                </pre>
            </div>
        );
    }
}
