import * as React from "react"
import {Tabs} from 'antd';
import MLSQLAceEditor from "../MLSQLAceEditor";

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
                content: <MLSQLAceEditor parent={this.parent} parentCallback={this.pushRef} activeKey='newTab0'/>,
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
            if (item.props.activeKey === activeKey) {
                currentItem = item
            }
        })
        return currentItem
    }

    onChange = (activeKey) => {
        this.setState({activeKey});
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({
            title: 'MLSQL ' + this.newTabIndex,
            content: <MLSQLAceEditor parent={this.parent} parentCallback={this.pushRef} activeKey={activeKey}/>,
            key: activeKey
        });
        this.setState({panes, activeKey});
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (panes.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key;
            } else {
                activeKey = panes[0].key;
            }
        }
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