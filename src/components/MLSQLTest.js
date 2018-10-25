import * as React from 'react'
import {Button, Classes, Code, FormGroup, H3, H5, InputGroup, Intent, Overlay, Switch} from "@blueprintjs/core";
import classNames from "classnames";
import './MLSQLTreeNode.scss'
import {MLSQLAPI} from "../service/MLSQLAPI";
import * as backendConfig from '../service/BackendConfig'
import * as HTTP from "../service/HTTPMethod"
import {APIResponse} from "../service/MLSQLAPI"

export class MLSQLTest extends React.Component {
    render() {
        return (
            <CreateScriptDialog></CreateScriptDialog>
        )
    }
}

class CreateScriptDialog extends React.Component {

    /**
     *
     * @param {{isDir:boolean, parentFolder:number,parent:ScriptNodeTree}} props
     */
    constructor(props) {
        super(props)
        /**
         * @type {{msg: string,fileName:string,content:string}}
         */
        this.state = {
            msg: ""
        }
    }

    title = () => {
        if (this.props.isDir) {
            return "Create Folder"
        }
        else return "Create Script"
    }

    fileName = (e) => {
        this.setState({fileName: e.target.value})
    }
    content = (e) => {
        this.setState({content: e.target.value})
    }

    finish = () => {
        this.props.parent.setState({openCreateScriptDialog: false})
    }

    create = () => {
        const params = new CreateFolerParams(this.state.fileName, this.props.isDir, this.state.content)
        const api = new MLSQLAPI(backendConfig.CREATE_SCRIPT_FILE)
        const self = this;

        /**
         *
         * @param {APIResponse} ok
         */
        const success = (ok) => {
            if (ok.status === HTTP.Status.Success) {
                self.finish()
            } else {
                ok.content.then((msg) => {
                    self.setState({msg: msg})
                })

            }
        }

        api.request(HTTP.Method.POST, params.params(), success, (notok) => {
            self.setState({msg: "Server error"})
        })

    }
    close = () => {
        /**
         * @type {ScriptNodeTree}
         */
        const parent = this.props.parent;
        parent.setState({openCreateScriptDialog: false})
    }

    render() {
        const OVERLAY_EXAMPLE_CLASS = "docs-overlay-example-transition";
        const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS);
        return (
            <div>
                <Overlay className="msql-treenode-dialog" isOpen={true} usePortal={true}>
                    <div className={classes}>
                        <H3>{this.title()} </H3>

                        <div className="msql-treenode-dialog-form">

                            <p>

                            </p>
                            <FormGroup
                                helperText="The file of name you want create."
                                label="fileName"
                                labelFor="fileName"
                                labelInfo="(required)">
                                <InputGroup id="fileName" placeholder="example.mlsql" onChange={this.fileName}/>
                            </FormGroup>
                        </div>
                        <br/>
                        <Button onClick={this.create}>
                            Create
                        </Button>

                        <Button intent={Intent.DANGER} onClick={this.close} style={{float: "right"}}>
                            Close
                        </Button>

                    </div>
                </Overlay>
            </div>

        )
    }
}

class CreateFolerParams {

    /**
     *
     * @param {string} fileName
     * @param {boolean} isDir
     * @param {string} content
     */
    constructor(fileName, isDir, content) {

        this._fileName = fileName;
        this._isDir = isDir;
        this._content = content;
    }

    get params() {
        return {
            fileName: this.fileName(),
            isDir: this.isDir(),
            content: this.content()
        }
    }


    get fileName() {
        return this._fileName;
    }

    set fileName(value) {
        this._fileName = value;
    }

    get isDir() {
        return this._isDir;
    }

    set isDir(value) {
        this._isDir = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }


}