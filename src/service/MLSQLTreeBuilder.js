import React, { useState, useCallback, useEffect } from 'react';
import { Tree, Spin,Menu,Dropdown } from 'antd';
import { DownOutlined, FileOutlined, FolderOutlined } from '@ant-design/icons';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
class MLSQLTreeNodeBuilder {

    /**
     *
     * Usage:
     *
     * convert flat array to tree structure
     *
     * input data：
     * [{"id":1,"icon":null,"label":null,"parentId":0},
     * {"id":2,"icon":"document","label":"jack","parentId":0},
     * {"id":3,"icon":"document","label":"dafe","parentId":0}
     * ]
     *
     * output:
     *
     * @param {[{id:number,icon:string,label:string,parentId:number,childNodes:[]}]} list
     */
    build = (list) => {

        let tempMap = {}, node, roots = [], i;
        for (i = 0; i < list.length; i += 1) {
            tempMap[list[i].id] = i;
            list[i].childNodes = [];
        }
        for (i = 0; i < list.length; i += 1) {
            node = list[i];
            if (node.parentId !== 0) {
                try {
                    list[tempMap[node.parentId]].childNodes.push(node);
                } catch (e) {
                    console.log("------------")
                    console.log(node)
                    console.log(tempMap[node.parentId])
                }

            } else {
                roots.push(node);
            }
        }
        return roots;
    }
    convert = (item) => {                
        if (item["childNodes"] && item["childNodes"].length > 0) {
            item["children"] = item["childNodes"]
            item["children"].map((cn) => {
                return this.convert(cn)
            })
        }
        item["id"] = String(item["id"])
        item["key"] = item["id"]
        // item["title"] = <span className="react-contextmenu-trigger"><ContextMenuTrigger  id="scriptTreeContextMenu">{item.label}</ContextMenuTrigger></span>
        item["title"] = <span>{item.label}</span>
        item["isLeaf"] = !item["isDir"]
        item["isExpand"] = !item["isExpanded"]
        if (item["isDir"]) {
            item["icon"] = <FolderOutlined />
        } else {
            item["icon"] = <FileOutlined />
        }

        return item
    }


}

export default MLSQLTreeNodeBuilder