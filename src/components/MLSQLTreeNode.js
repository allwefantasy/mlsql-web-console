import * as React from "react";
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


import {
    Button,
    Classes,
    Icon,
    Overlay,
    Position,
    Tooltip,
    Tree,
    Code,
    H3,
    H5,
    Intent,
    Switch,
    InputGroup, FormGroup
} from "@blueprintjs/core";
import {ContextMenu, Menu, MenuItem} from "@blueprintjs/core";
import classNames from "classnames";
import {MLSQLAPI, APIResponse} from "../service/MLSQLAPI";
import * as HTTP from "../service/HTTPMethod"
import './MLSQLTreeNode.scss'
import * as backendConfig from "../service/BackendConfig";
import MLSQLTreeBuilder from "../service/MLSQLTreeBuilder"

//the directory tree in the left
export class ScriptNodeTree extends React.Component {

    constructor(props) {
        super(props)

        /**
         * @type {{isContextMenuOpen: boolean,openCreateScriptDialog: boolean}}
         */
        this.state = {isContextMenuOpen: false, openCreateScriptDialog: false};
        this.parent = this.props.parent
        this.reloadData()

    }

    reloadData = () => {

        const api = new MLSQLAPI(backendConfig.CREATE_SCRIPT_FILE)
        const self = this;
        /**
         *
         * @param {APIResponse} ok
         */
        const success = (ok) => {
            ok.content.then((s) => {
                /**
                 *
                 * @type {[{id:number,icon:string,label:string,parentId:number,isDir:boolean,childNodes:[]}]}
                 */
                let rawData = []
                try {
                    rawData = JSON.parse(s || "[]")
                } catch (e) {

                }

                const builder = new MLSQLTreeBuilder()
                const treeRes = builder.build(rawData).sort((a, b) => {
                    return a.id - b.id
                })
                self.setState({nodes: treeRes})
            })
        }
        api.request(HTTP.Method.GET, {}, success, (notok) => {
        })
    }

    render() {

        return (
            <div>
                <Tree
                    contents={this.state.nodes}
                    onNodeClick={this.handleNodeClick}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                    onNodeContextMenu={this.onNodeContextMenu}
                    onNodeDoubleClick={this.handNodeDoubleClick}
                    className="mlsql-directory-tree"
                />
                {this.state.openCreateScriptDialog ?
                    <CreateScriptDialog nodeId={this.state.nodeId} parent={this}
                                        queryApp={this.parent}></CreateScriptDialog> : ""}

            </div>
        );
    }

    isRootNode = (nodeId) => {
        return this.state.nodes[0].id === nodeId
    }

    onNodeContextMenu = (node, _nodePath, e) => {
        e.preventDefault()
        const self = this;
        ContextMenu.show(
            <ScriptNodeTreeMenu parent={self} nodeId={node.id}/>,
            {left: e.clientX, top: e.clientY},
            () => this.setState({isContextMenuOpen: false}),
        );
        this.setState({isContextMenuOpen: true});
    }

    handNodeDoubleClick = (node, _nodePath, e) => {
        if (node.isDir) {
            node.isExpanded = !node.isExpanded;
            this.toggleIsExpanded(node.id, node.isExpanded)
        } else {
            const api = new MLSQLAPI(backendConfig.GET_SCRIPT_FILE)
            const self = this;
            api.request(HTTP.Method.GET, {id: node.id}, (ok) => {
                ok.content.then((s) => {
                    const scriptFile = JSON.parse(s || "{}")
                    self.parent.editor.current.text(scriptFile.content, node.id)
                })
            }, (fail) => {
            })


        }
        this.setState(this.state);

    };

    handleNodeClick = (nodeData, _nodePath, e) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);
    };

    toggleIsExpanded = (id, isExpanded) => {
        const api = new MLSQLAPI(backendConfig.CREATE_SCRIPT_FILE)
        const self = this;
        api.request(HTTP.Method.POST, {id: id, isExpanded: isExpanded}, (ok) => {
            ok.content.then((s) => {

            })
        }, (fail) => {
        })
    }

    handleNodeCollapse = (nodeData) => {
        nodeData.isExpanded = false;
        this.setState(this.state);
    };

    handleNodeExpand = (nodeData) => {
        nodeData.isExpanded = true;
        this.setState(this.state);
    };

    forEachNode(nodes, callback) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }
}

class CreateScriptDialog extends React.Component {

    /**
     *
     * @param {{parentFolder:number,parent:ScriptNodeTree,nodeId:number}} props
     */
    constructor(props) {
        super(props)
        /**
         * @type {{msg: string,fileName:string,content:string}}
         */
        this.state = {
            msg: ""
        }
        this.messageBox = this.props.queryApp.messageBox.current.editor
        this.directoryTree = this.props.parent
    }

    title = () => {
        if (this.props.parent.state.isDir) {
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
        this.props.parent.reloadData()
    }

    create = () => {

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
                    this.setState({"msg": msg})
                })

            }
        }

        const params = {
            fileName: this.state.fileName,
            isDir: this.props.parent.state.isDir,
            content: this.state.content,
            parentId: this.props.nodeId
        }

        if (!params.fileName) {
            this.setState({"msg": "filename should not be empty"})
            return
        }

        if (!params.isDir && !params.fileName.endsWith(".mlsql")) {
            this.setState({"msg": "filename should be ends with .mlsql"})
            return
        }

        api.request(HTTP.Method.POST, params, success, (notok) => {
            self.setState({msg: "Server error"})
        })

    }
    close = () => {
        /**
         * @type {ScriptNodeTree}
         */
        const parent = this.props.parent;
        parent.setState({openCreateScriptDialog: false})
        parent.reloadData()
    }

    render() {
        const OVERLAY_EXAMPLE_CLASS = "docs-md-overlay-example-transition";
        const classes = classNames(Classes.CARD, Classes.ELEVATION_4, OVERLAY_EXAMPLE_CLASS);
        return (
            <div>
                <Overlay className="msql-treenode-dialog" isOpen={true} usePortal={true}>
                    <div className={classes}>
                        <H3>{this.title()} </H3>

                        <div className="msql-treenode-dialog-form">

                            <p style={{color: "red"}}>
                                {this.state.msg}
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

class ScriptNodeTreeMenu extends React.Component {

    /**
     *
     * @param {{parent:ScriptNodeTree}} props
     */
    constructor(props) {
        super(props)
        this.parent = this.props.parent
        this.nodeId = this.props.nodeId
    }
	
    confirmDelete = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to do this ？',
            buttons: [
             {
                 label: 'confirm',
                 onClick: () => this.removeFile()
             },
             {
                 label: 'cancel',
                 onClick: () => {}
             }
            ],
            closeOnEscape: true, closeOnClickOutside: false
        });
    }

    removeFile = () => {
        const api = new MLSQLAPI(backendConfig.REMOVE_SCRIPT_FILE)
        const self = this;

        api.request(HTTP.Method.POST, {
            id: self.nodeId
        }, (ok) => {
            if (ok.status === HTTP.Status.Success) {
                self.parent.reloadData()
            } else {
                ok.content.then((msg) => {
                    self.parent.setState({msg: msg})
                })

            }

        }, (fail) => {
            self.parent.setState({msg: "Server error"})
        })
    }

    isCreateProject = () => {
        return this.parent.isRootNode(this.nodeId)
    }

    createDocMenuItem = () => {
        if (!this.isCreateProject()) {
            return <MenuItem icon="document" text="Create Script" onClick={(() => {
                this.parent.setState({
                    openCreateScriptDialog: true,
                    nodeId: this.nodeId,
                    isDir: false
                })
            }).bind(this)}/>
        }
    }

    createFolderTitle = () => {
        if (!this.isCreateProject()) {
            return "Create Folder"
        }
        else {
            return "Create Project"
        }
    }

    deleteMenu = () => {
        if (!this.isCreateProject()) {
            return <MenuItem icon="remove" text="Delete" onClick={(() => {
                this.confirmDelete()
            }).bind(this)}/>
        }
    }


    render() {
        return (
            <div>
                <Menu>
                    {this.createDocMenuItem()}
                    <MenuItem icon="folder-new" text={this.createFolderTitle()} onClick={(() => {
                        this.parent.setState({
                            openCreateScriptDialog: true,
                            nodeId: this.nodeId,
                            isDir: true
                        })
                    }).bind(this)}/>
                    {this.deleteMenu()}
                </Menu>
            </div>
        )
    }
}



