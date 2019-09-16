import * as React from "react";
import {Button, message, Steps, Form, Input, Card} from "antd";
import ResultView from "./ResultView";

const Step = Steps.Step;
const formItemLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8},
};
const formTailLayout = {
    labelCol: {span: 4},
    wrapperCol: {span: 8, offset: 4},
};

class ScriptPluginView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            steps: props.steps.concat([{desc: "MLSQL Script", "final": true}])
        }
        this.nav = props.parent
    }

    next() {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const current = this.state.current + 1;
                this.setState({current});
                this.nav.pushParam(values)
            }
        });


    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    buildForm = (item) => {
        if (item.hasOwnProperty("final")) {
            return <ResultView nav={this.nav}/>
        }
        const formItems = item["params"]
        const {getFieldDecorator} = this.props.form;
        return formItems.map((formItem) => {
            return <Form.Item {...formItemLayout} label={formItem['name']}>
                {getFieldDecorator(formItem['name'], {
                    rules: [{required: formItem['required'], message: `Please input ${formItem['required']}!`}],
                })(
                    <Input type="input" placeholder={formItem['desc']}/>
                )}
            </Form.Item>
        })
    }


    render() {
        const {current} = this.state;
        return (
            <div>

                <Steps current={current}>
                    {this.state.steps.map(item => <Step key={item.desc} title={item.desc}/>)}
                </Steps>
                <div className="steps-content"
                     style={{"margin-top": "30px"}}>
                    <Card bordered={true}>
                        <Form {...formTailLayout} style={{width: "600px"}}>
                            {this.buildForm(this.state.steps[current])}
                        </Form>
                    </Card>


                </div>
                <div className="steps-action" style={{marginTop: "30px"}}>
                    {
                        current < this.state.steps.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next Step</Button>
                    }
                    {
                        current === this.state.steps.length - 1
                        && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        current > 0
                        && (
                            <Button style={{marginLeft: 8}} onClick={() => this.prev()}>
                                Previous Step
                            </Button>
                        )
                    }
                </div>


            </div>
        );
    }
}

export const ScriptPluginViewForm = Form.create({name: "plugin-tutorial"})(ScriptPluginView);