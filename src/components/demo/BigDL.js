import * as React from "react";
import {Steps, Button, message, List} from 'antd';
import MLSQLAceEditor from "../MLSQLAceEditor";
import '../MLSQLQueryApp.scss'
import AceEditor from "react-ace";
import {MLSQLDash} from "../query/MLSQLDash";
import {MLSQLQueryDisplay} from "../MLSQLQueryDisplay";

const Step = Steps.Step;


export default class BigDL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        }
        this.editor = React.createRef()
        this.dash = React.createRef()
        this.display = React.createRef()
        this.messageBox = React.createRef()

        this.techData = [[
            "Step 0: Clear the content in editor",
            "Step 1: Click Quick Menu",
            "Step 2: Drag Tools/Download uploaded file to Editor",
            "Step 3: An dialog will be opened, fill field from with 'public/cifar' and field to with '/tmp/cifar'",
            "Step 4: Click Ok in dialog",
            "Step 5: Click button Run(Since there are so many files, it will take a while.)"
        ],
            [
                "Step 0: Clear the content in editor",
                "Step 1: Click Quick Menu",
                "Step 2: Drag Tools/Download uploaded file to Editor",
                "Step 3: An dialog will be opened, fill field from with 'public/cifar' and field to with '/tmp/cifar'",
                "Step 4: Click Ok in dialog",
                "Step 5: Click button Run(Since there are so many files, it will take a while.)"
            ],
        ]

        this.commandData = [`run command as DownloadExt.\`\` where 
from="public/cifar" and
to="/tmp/cifar";`,
            `------`
        ]

        const generateView = (step) => {
            return <div style={{marginTop: "30px"}}>
                <List
                    header={<div>How to do:</div>}
                    footer={<div>Congratulation</div>}
                    bordered
                    dataSource={this.techData[step]}
                    renderItem={item => (<List.Item>{item}</List.Item>)}
                />
                <div className="mlsql-queryapp">
                    <div className="mlsql-editor">
                        <MLSQLAceEditor ref={this.editor} parent={this}/>
                        <div className="mlsql-messagebox">
                            <AceEditor
                                height={"100px"}
                                width={"100%"}
                                ref={this.messageBox}
                                mode="text"
                                theme="github"
                                name="message_box"
                            />
                        </div>
                        <div>
                            <MLSQLDash ref={this.dash} parent={this}/>
                        </div>
                        <div className="mlsql-query-display">
                            <MLSQLQueryDisplay ref={this.display} parent={this}/></div>
                    </div>
                </div>
            </div>
        }


        this.steps = [{
            title: 'Download Cifar10 Images',
            content: generateView(0),
        }, {
            title: 'Resize Images',
            content: generateView(1),
        }, {
            title: 'Last',
            content: 'Last-content',
        }];
    }

    setData = (data) => {
        this.queryResData = data
        this.dash.current.refresh()
    }

    getEditor = () => {
        return this.editor.current.aceEditorRef.current.editor
    }

    componentDidMount() {
        setTimeout(() => {
            this.getEditor().setValue(this.commandData[0], -1)
        }, 1000)
    }

    next() {
        const current = this.state.current + 1;
        this.setState({current});
        setTimeout(() => {
            this.getEditor().setValue(this.commandData[current], -1)
        }, 1000)

    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
    }

    render() {
        const {current} = this.state;
        return (
            <div>
                <Steps current={current}>
                    {this.steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className="steps-content">{this.steps[current].content}</div>
                <div className="steps-action">
                    {
                        current < this.steps.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next</Button>
                    }
                    {
                        current === this.steps.length - 1
                        && <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        current > 0
                        && (
                            <Button style={{marginLeft: 8}} onClick={() => this.prev()}>
                                Previous
                            </Button>
                        )
                    }
                </div>
            </div>
        );
    }
}