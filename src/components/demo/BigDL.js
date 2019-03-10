import * as React from "react";
import {Steps, Button, message, List} from 'antd';
import MLSQLAceEditor from "../MLSQLAceEditor";
import '../MLSQLQueryApp.scss'
import AceEditor from "react-ace";
import {MLSQLDash} from "../query/MLSQLDash";
import {MLSQLQueryDisplay} from "../MLSQLQueryDisplay";

const Step = Steps.Step;
const ReactMarkdown = require('react-markdown')


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

        this.techData = this.generateTechData()
        this.commandData = this.generateCommandData()
        this.steps = this.generateSteps()
    }

    generateView(step) {
        return <div style={{marginTop: "30px"}}>
            {this.techData[step].length > 0 && <List
                header={<div>How to do:</div>}
                footer={<div>Congratulations</div>}
                bordered
                dataSource={this.techData[step]}
                renderItem={item => (<List.Item>{item}</List.Item>)}
            />}

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

    generateSteps() {
        return [{
            title: 'Download Cifar10 Images',
            content: this.generateView(0),
        }, {
            title: 'Resize Images',
            content: this.generateView(1),
        }, {
            title: 'Extract Label',
            content: this.generateView(2),
        }, {
            title: 'Train',
            content: this.generateView(3),
        }, {
            title: 'Predict',
            content: this.generateView(4),
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
            try {
                this.getEditor().setValue(this.commandData[0], -1)
            } catch (e) {

            }

        }, 1000)
    }

    next() {
        const current = this.state.current + 1;
        this.setState({current});
        setTimeout(() => {
            try {
                this.getEditor().setValue(this.commandData[current], -1)
            } catch (e) {

            }
        }, 1000)

    }

    prev() {
        const current = this.state.current - 1;
        this.setState({current});
        setTimeout(() => {
            try {
                this.getEditor().setValue(this.commandData[current], -1)
            } catch (e) {

            }
        }, 1000)
    }

    render() {
        const {current} = this.state;
        return (
            <div>
                <div className="steps-action" style={{marginBottom: "30px"}}>
                    {
                        current < this.steps.length - 1
                        && <Button type="primary" onClick={() => this.next()}>Next Step</Button>
                    }
                    {
                        current === this.steps.length - 1
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
                <Steps current={current}>
                    {this.steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className="steps-content">{this.steps[current].content}</div>

            </div>
        );
    }

    generateTechData() {
        return [
            [
                "Step 0: Clear the content in editor",
                "Step 1: Click Quick Menu",
                "Step 2: Drag Tools/Download uploaded file to Editor",
                "Step 3: An dialog will be opened, fill field [from] with 'public/cifar.tar' and field [to] with '/tmp'",
                "Step 4: Click Ok in dialog",
                "Step 5: Click button Run(Since there are so many files, it will take a while.)"
            ],
            [
                "Step 0: Clear the content in editor",
                "Step 1: Click Quick Menu",
                "Step 2: Drag Tools/Load images",
                <ReactMarkdown source={"Step 3: An dialog will be opened\n" +
                "fill field [Output table] with 'images'\n" +
                "field [imageDir]  with '/tmp/cifar'\n" +
                "field [code]  with \n" +
                "\n" +
                "```scala\n" +
                "def apply(params:Map[String,String]) = {\n" +
                "         Resize(256, 256) -> CenterCrop(224, 224) ->\n" +
                "          MatToTensor() -> ImageFrameToSample()\n" +
                "       }\n" +
                "```"}/>,
                "Step 4: Click Ok in dialog",
                "Step 5: Click button Run"
            ],
            [
                "Step 0: Use set statement to set a variable named labelMappingPath.",
                "Step 1: extract the class name from path",
                "Step 2: map label string to number",
                "Step 3: add 1 to label number since the bigdl requires that.",
                "Step 4: finally, we get features and label",
                "Step 5: Click button Run"
            ],
            [
                "Step 0: Clear the content in editor",
                "Step 1: Click Quick Menu",
                "Step 2: Drag Algorithms/Deep Learning",
                <ReactMarkdown source={"Step 3: An dialog will be opened  \n" +
                "fill field [tableName] with 'trainData'  \n" +
                "field [Model save path]  with '/tmp/bigdl' \n" +
                "field [code]  with    \n" +
                "```scala  \n" +
                " def apply(params:Map[String,String])={\n" +
                "                        val model = Sequential()\n" +
                "                        model.add(Reshape(Array(3, 28, 28), inputShape = Shape(28, 28, 3)))\n" +
                "                        model.add(Convolution2D(6, 5, 5, activation = \"tanh\").setName(\"conv1_5x5\"))\n" +
                "                        model.add(MaxPooling2D())\n" +
                "                        model.add(Convolution2D(12, 5, 5, activation = \"tanh\").setName(\"conv2_5x5\"))\n" +
                "                        model.add(MaxPooling2D())\n" +
                "                        model.add(Flatten())\n" +
                "                        model.add(Dense(100, activation = \"tanh\").setName(\"fc1\"))\n" +
                "                        model.add(Dense(params(\"classNum\").toInt, activation = \"softmax\").setName(\"fc2\"))\n" +
                "                    }" +
                "```  \n"}/>,
                "Step 4: Click Ok in dialog",
                <ReactMarkdown source={"Step 5: modify the where statement, add \n" +
                "```\n" +
                "fitParam.0.featureSize=\"[3,28,28]\"\n" +
                "and fitParam.0.classNum=\"10\"\n" +
                "and fitParam.0.maxEpoch=\"50\"\n" +
                "```"}/>,
                "Step 6: Click button Run"
            ],
            []
        ]
    }

    generateCommandData() {
        return [
            `run command as DownloadExt.\`\` where 
            from="public/cifar.tar" 
            and to="/tmp";`.stripMargin(),


            `run command as ImageLoaderExt.\`/tmp/cifar\` 
            where code='''
        def apply(params:Map[String,String]) = {
         Resize(256, 256) -> CenterCrop(224, 224) ->
          MatToTensor() -> ImageFrameToSample()
       }''' as images;`.stripMargin(),


            `-- convert image path to number label 
            set labelMappingPath = "/tmp/si"; 
            select split(split(imageName,"_")[1],"\\\\.")[0] as labelStr,features from images as tempData;
            --convert the label string to number 
            train tempData as StringIndex.\`\${labelMappingPath}\` where inputCol="labelStr" and outputCol="labelIndex";
            predict tempData as StringIndex.\`\${labelMappingPath}\` as tempData;
            -- Since the bigdl need label number from 1, we should plus one
            select (cast(labelIndex as float) + 1) as label,features from tempData as trainData;`.stripMargin(),


            `--train with LeNet5 model
            set modelPath = "/tmp/bigdl";            
            train trainData as BigDLClassifyExt.\`\${modelPath}\` where
            fitParam.0.featureSize="[3,28,28]"
            and fitParam.0.classNum="10"
            and fitParam.0.maxEpoch="50"
            and fitParam.0.code='''
            |       def apply(params:Map[String,String])={
            |            val model = Sequential()
            |            model.add(Reshape(Array(3, 28, 28), inputShape = Shape(28, 28, 3)))
            |            model.add(Convolution2D(6, 5, 5, activation = "tanh").setName("conv1_5x5"))
            |            model.add(MaxPooling2D())
            |            model.add(Convolution2D(12, 5, 5, activation = "tanh").setName("conv2_5x5"))
            |            model.add(MaxPooling2D())
            |            model.add(Flatten())
            |            model.add(Dense(100, activation = "tanh").setName("fc1"))
            |            model.add(Dense(params("classNum").toInt, activation = "softmax").setName("fc2"))
            |        }''';
            `.stripMargin(),

            `set modelPath = "/tmp/bigdl";
            
            -- batch predict            
            predict trainData as BigDLClassifyExt.\`\${modelPath}\` as predictdata;
            
            -- register BigDLClassifyExt.\`/tmp/bigdl\` as cifarPredict;
            select vec_argmax(cifarPredict(vec_dense(features))) as predicted_label,
            label from trainData
            as output;`.stripMargin()


        ]
    }
}