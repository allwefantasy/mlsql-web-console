import * as React from "react";

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


export class ScriptNodeTree extends React.Component {

    constructor(props) {
        super(props)

        /**
         * @type {{isContextMenuOpen: boolean,openCreateScriptDialog: boolean}}
         */
        this.state = {isContextMenuOpen: false, openCreateScriptDialog: false};

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
                const rawData = JSON.parse(s || "[]")
                rawData.forEach((item) => {
                    item["hasCaret"] = item.isDir
                })
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
                    className={Classes.ELEVATION_0}
                />
                {this.state.openCreateScriptDialog ?
                    <CreateScriptDialog nodeId={this.state.nodeId} parent={this}></CreateScriptDialog> : ""}

            </div>
        );
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

    handleNodeClick = (nodeData, _nodePath, e) => {
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, n => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);
    };

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
                    self.setState({msg: msg})
                })

            }
        }

        const params = {
            fileName: this.state.fileName,
            isDir: this.props.parent.state.isDir,
            content: this.state.content,
            parentId: this.props.nodeId
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

class ScriptNodeTreeMenu extends React.Component {

    /**
     *
     * @param {{parent:ScriptNodeTree}} props
     */
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Menu>
                    <MenuItem icon="document" text="Create Script" onClick={(() => {
                        this.props.parent.setState({
                            openCreateScriptDialog: true,
                            nodeId: this.props.nodeId,
                            isDir: false
                        })
                    }).bind(this)}/>
                    <MenuItem icon="folder-new" text="Create Folder" onClick={(() => {
                        this.props.parent.setState({
                            openCreateScriptDialog: true,
                            nodeId: this.props.nodeId,
                            isDir: true
                        })
                    }).bind(this)}/>
                </Menu>
            </div>
        )
    }
}

/* tslint:disable:object-literal-sort-keys so childNodes can come last */
const INITIAL_STATE = [
    {
        id: 0,
        hasCaret: true,
        icon: "folder-close",
        label: "Folder 0",
    },
    {
        id: 1,
        icon: "folder-close",
        isExpanded: true,
        label: (
            <Tooltip content="I'm a folder <3" position={Position.RIGHT}>
                Folder 1
            </Tooltip>
        ),
        childNodes: [
            {
                id: 2,
                icon: "document",
                label: "Item 0",
                secondaryLabel: (
                    <Tooltip content="An eye!">
                        <Icon icon="eye-open"/>
                    </Tooltip>
                ),
            },
            {
                id: 3,
                icon: "tag",
                label: "Organic meditation gluten-free, sriracha VHS drinking vinegar beard man.",
            },
            {
                id: 4,
                hasCaret: true,
                icon: "folder-close",
                label: (
                    <Tooltip content="foo" position={Position.RIGHT}>
                        Folder 2
                    </Tooltip>
                ),
                childNodes: [
                    {id: 5, label: "No-Icon Item"},
                    {id: 6, icon: "tag", label: "Item 1"},
                    {
                        id: 7,
                        hasCaret: true,
                        icon: "folder-close",
                        label: "Folder 3",
                        childNodes: [
                            {id: 8, icon: "document", label: "Item 0"},
                            {id: 9, icon: "tag", label: "Item 1"},
                        ],
                    },
                ],
            },
        ],
    },
];


