import * as React from "react"
import {Tabs} from 'antd';
import MLSQLAceEditor from "../MLSQLAceEditor";
import NodeBook from "../notebook/NoteBook";
import PythonEditor from "../python/PythonEditor";

const TabPane = Tabs.TabPane;

export class TabEditor extends React.Component {
    constructor(props) {
        super(props);
        this.parent = props.parent
        this.myRefs = []
        this.newTabIndex = 0;
        const panes = [
            {
                title: 'MLSQL 1',
                content: <MLSQLAceEditor parent={this.parent} parentCallback={(ref) => {
                    this.pushRef({ref: ref, activeKey: "newTab0"})
                }} activeKey='newTab0'/>,
                key: 'newTab0'
            },
        ];
        this.state = {
            activeKey: panes[0].key,
            panes,
        };
        this.newTabIndex++
    }

    pushRef = (ref) => {
        this.myRefs.push(ref)
    }

    getCurrentEditor = () => {
        const activeKey = this.state.activeKey;
        let currentItem = null
        this.myRefs.forEach(item => {
            if (item.activeKey === activeKey) {
                currentItem = item
            }
        })
        return currentItem
    }

    onChange = (activeKey) => {

        let currentItem = null

        this.state.panes.forEach(item => {
            if (item.key === activeKey) {
                currentItem = item
            }
        })

        if (currentItem && !currentItem.title.endsWith(".mlsql")) {
            this.parent.setState({displayEditor: "normal"})
        } else if(currentItem && !currentItem.title.endsWith(".nb")) {
            this.parent.setState({displayEditor: "notebook"})
        }else {
            this.parent.setState({displayEditor: "pythoneditor"})
        }

        this.setState({activeKey});
    }

    onEdit = (targetKey, action) => {        
        this[action](targetKey);
    }

    addFull = (tabName, callback) => {    
        const editor = (activeKey) => {
            if (tabName.endsWith(".mlsql")) {
                return <MLSQLAceEditor parent={this.parent} parentCallback={(ref) => {
                    this.pushRef({ref: ref, activeKey: activeKey})
                    if (callback) {
                        callback({ref: ref, activeKey: activeKey})
                    }
                }} activeKey={activeKey}/>
            } else if(tabName.endsWith(".nb")) {
                return <NodeBook parent={this.parent} parentCallback={(ref) => {
                    this.pushRef({ref: ref, activeKey: activeKey})
                    if (callback) {
                        callback({ref: ref, activeKey: activeKey})
                    }
                }} activeKey={activeKey}/>
            }else if(tabName.endsWith(".py")) {
                return <PythonEditor parent={this.parent} parentCallback={(ref) => {
                    this.pushRef({ref: ref, activeKey: activeKey})
                    if (callback) {
                        callback({ref: ref, activeKey: activeKey})
                    }
                }} activeKey={activeKey}/>
            }
        }

        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({
            title: tabName || 'MLSQL ' + this.newTabIndex,
            content: editor(activeKey),
            key: activeKey
        });
        this.setState({panes, activeKey});
    }

    add = () => {
        this.addFull('MLSQL ' + (this.newTabIndex+1),(params)=>{})
    }

    getPaneIndexByActiveKey = (targetKey) => {
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        return lastIndex
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex = this.getPaneIndexByActiveKey(targetKey)

        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
        const editorRefList = this.myRefs.filter((item) => item.activeKey === targetKey)
        this.myRefs = this.myRefs.filter((item) => item.activeKey !== targetKey)
        this.parent.closeEditor(editorRefList[0])

        this.setState({panes, activeKey});
    }

    render() {
        return (
            <Tabs
                onChange={this.onChange}
                activeKey={this.state.activeKey}
                type="editable-card"
                onEdit={this.onEdit}
            >
                {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}
                                                       closable={pane.closable}>{pane.content}</TabPane>)}
            </Tabs>
        );
    }
}