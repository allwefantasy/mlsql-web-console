import * as React from "react";
import brace from 'brace';
import 'brace/ext/searchbox';
import AceEditor from 'react-ace';
import 'brace/mode/scala';
import 'brace/mode/python';
import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/ext/language_tools'
import {
    Select, Form, Icon, Input, Button, Checkbox, Col, Row
} from 'antd';
import Switch from "../../../node_modules/antd/lib/switch";

const Option = Select.Option;
const {TextArea} = Input;

export class ETPopScriptUDF extends React.Component {

    constructor(props) {
        super(props)
        this.etpop = props.parent
        this.name = props.name
        this.data = {params: {}}
        this.state = {dataForRender: []}
        this.codeRef = React.createRef()
        this.codeCheckRef = React.createRef()
    }

    udfName = (evt) => {
        this.data.udfNameV = evt.target.value
    }

    dataType = (evt) => {
        this.data.dataTypeV = evt.target.value
    }

    udfType = (value) => {
        this.udfTypeV = value
    }

    code = (newValue) => {
        this.codeV = newValue
    }


    componentDidMount() {

    }

    langSelect = (value) => {
        this.lang = value
        this.codeCheckRef.current.checked = false
        this.setState({dataType: false})
        if (this.lang === "python") {
            this.setState({dataType: true})
        }
        this.setState({codeLang: value})


    }

    setCodeExample = (checked) => {
        if (checked) {
            this.codeRef.current.editor.setValue(this.codeExample())
        } else {
            this.codeRef.current.editor.setValue("")
        }

    }

    codeExample = () => {
        const lang = this.state.codeLang || "scala"
        if (lang === "scala") {
            return `def apply(a:Double,b:Double)={
   a + b
}`
        }

        if (lang === "python") {
            return `def apply(self,m):
    return m`
        }

        if (lang === "java") {
            return `import java.util.HashMap;
import java.util.Map;
public class UDF {
  public Map<String, Integer[]> apply(String s) {
    Map<String, Integer[]> m = new HashMap<>();
    Integer[] arr = {1};
    m.put(s, arr);
    return m;
  }
}`
        }
        return null
    }

    showDataType = () => {
        if (this.state.dataType) {
            return <Row>
                <Col>
                    dataType:<TextArea style={{marginBottom: "10px"}} name={"dataType"} rows={10}
                                       onChange={this.dataType}
                                       type="text"
                                       addonBefore={"dataType"}
                                       placeholder={`This is not required when lang is scala
As we know python is not strongly typed language, so
we should manually spcify the return type.
map(string,string) means a map with key is string type,value also is string type.
array(string) means a array with string type element.
nested is support e.g. array(array(map(string,array(string))))

`}/>
                </Col>
            </Row>

        }
        return null
    }

    showCode = () => {
        return <div><Row>
            <Col>
                code:<AceEditor ref={this.codeRef}
                                mode={this.state.codeLang || "scala"}
                                theme="github"
                                width={"400px"}
                                height={"300px"}
                                name="code"
                                fontSize={16}
                                showPrintMargin={true}
                                showGutter={true}
                                highlightActiveLine={true}
                                onChange={this.code}
                                editorProps={{
                                    $blockScrolling: Infinity
                                }}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: false,
                                    showLineNumbers: true,
                                    tabSize: 2,
                                }}
            />
            </Col>
        </Row>
            <Row>
                <Col>
                    <Col span={8}>
                        Show CodeExample:<Switch ref={this.codeCheckRef} onChange={this.setCodeExample}/>
                    </Col>
                </Col>
            </Row></div>
    }

    makeMLSQL = () => {
        const self = this
        let paramsArray = []
        paramsArray.push(`lang="${this.lang}"`)
        paramsArray.push(`code='''${this.codeV}'''`)
        paramsArray.push(`udfType="${this.udfTypeV}"`)
        if (this.dataTypeV) {
            paramsArray.push(`dataType='''${this.dataTypeV}'''`)
        }
        return `register ScriptUDF.\`\` as ${this.data.udfNameV} where 
${paramsArray.join("\nand ")};`
    }

    render() {
        return <div>

            <Row>
                <Col>
                    <Input onChange={this.udfName} type="text" size={"large"} addonBefore="UDF Name"
                           placeholder="the name of udf"/>
                </Col>
            </Row>
            <br/>

            <Row>
                <Col span={4}>
                    <span>udfType:</span>
                </Col>
                <Col span={20}>
                    <Select
                        showSearch
                        onChange={this.udfType}
                        style={{width: 200}}
                        placeholder="Select udf type"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value="udf">udf</Option>
                        <Option value="udaf">udaf</Option>
                    </Select>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col span={4}>
                    <span>Lang:</span>
                </Col>
                <Col span={20}>
                    <Select
                        showSearch
                        style={{width: 200}}
                        placeholder="Select language type"
                        optionFilterProp="children"
                        onChange={this.langSelect}
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                        <Option value="java">java</Option>
                        <Option value="scala">scala</Option>
                        <Option value="python">python</Option>
                    </Select>
                </Col>
            </Row>
            <br/>
            {this.showDataType()}
            <br/>
            {this.showCode()}
            <br/>
            <Row>
                <Col>
                    <Input style={{marginBottom: "10px"}} name={"methodName"} onChange={this.params} type="text"
                           addonBefore={"methodName"}
                           placeholder={"methodName"}/>
                </Col>
            </Row>


        </div>
    }
}
